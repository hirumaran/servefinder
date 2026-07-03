"use client";

/**
 * Picked-causes state shared across pages, persisted to this device's
 * localStorage only (see lib/interests.ts for the privacy rationale).
 *
 * Implementation mirrors the store style used elsewhere in the app: a tiny
 * module-level store exposed via useSyncExternalStore. The in-memory snapshot
 * is the source of truth (so picking still works for the current visit when
 * storage is blocked), localStorage is the persistence layer, and a "storage"
 * listener keeps other tabs in sync. Server and hydration renders see "no
 * picks, not onboarded"; `hydrated` flips true with the first client snapshot
 * so pages can hold a skeleton instead of flashing the wrong state.
 */

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

import {
  INTERESTS_STORAGE_KEY,
  ONBOARDED_STORAGE_KEY,
  parseInterests,
  serializeInterests,
} from "./interests";
import type { Category } from "./types";

interface InterestsState {
  interests: readonly Category[];
  onboarded: boolean;
}

const SERVER_STATE: InterestsState = { interests: [], onboarded: false };

/** null = localStorage not read yet (also true for the whole server render). */
let state: InterestsState | null = null;
const listeners = new Set<() => void>();

/** The boot script in app/layout.tsx sets this before first paint. */
const INTRO_HTML_ATTR = "data-servd-intro";

function safeRead(): InterestsState {
  try {
    return {
      interests: parseInterests(window.localStorage.getItem(INTERESTS_STORAGE_KEY)),
      onboarded: window.localStorage.getItem(ONBOARDED_STORAGE_KEY) !== null,
    };
  } catch {
    // Storage can be blocked (private mode, embedded webviews) — treat the
    // visitor as onboarded so the intro never traps them, and run in-memory.
    return { interests: [], onboarded: true };
  }
}

function persist(next: InterestsState) {
  try {
    // No picks removes the key outright, so clearing leaves zero footprint.
    if (next.interests.length === 0) {
      window.localStorage.removeItem(INTERESTS_STORAGE_KEY);
    } else {
      window.localStorage.setItem(INTERESTS_STORAGE_KEY, serializeInterests(next.interests));
    }
    if (next.onboarded) {
      window.localStorage.setItem(ONBOARDED_STORAGE_KEY, "1");
    } else {
      window.localStorage.removeItem(ONBOARDED_STORAGE_KEY);
    }
  } catch {
    // Quota/blocked storage: the in-memory copy still works for this visit.
  }
}

function getSnapshot(): InterestsState {
  if (state === null) state = safeRead();
  return state;
}

function getServerSnapshot(): InterestsState {
  return SERVER_STATE;
}

function setState(next: InterestsState) {
  state = next;
  persist(next);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab edited the picks: refresh the cache, then re-render.
  // (key === null means localStorage.clear() from another tab.)
  function onStorage(event: StorageEvent) {
    if (
      event.key === INTERESTS_STORAGE_KEY ||
      event.key === ONBOARDED_STORAGE_KEY ||
      event.key === null
    ) {
      state = safeRead();
      listener();
    }
  }
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function toggleInterest(category: Category) {
  const current = getSnapshot();
  const interests = current.interests.includes(category)
    ? current.interests.filter((c) => c !== category)
    : [...current.interests, category];
  setState({ ...current, interests });
}

function completeOnboarding() {
  setState({ ...getSnapshot(), onboarded: true });
  document.documentElement.removeAttribute(INTRO_HTML_ATTR);
}

function resetOnboarding() {
  // Keeps the picks — replaying the intro shouldn't wipe them; the picker
  // pre-checks what was chosen before.
  setState({ ...getSnapshot(), onboarded: false });
  document.documentElement.setAttribute(INTRO_HTML_ATTR, "");
}

interface InterestsContextValue {
  /** Picked causes, in the order they were picked. Empty until `hydrated`. */
  interests: readonly Category[];
  /** False on the server/hydration pass, before localStorage has been read. */
  hydrated: boolean;
  /** True once the visitor has been through (or skipped) the intro. */
  onboarded: boolean;
  toggleInterest: (category: Category) => void;
  /** Marks the intro as seen and unlocks the page behind it. */
  completeOnboarding: () => void;
  /** Un-marks the intro so it plays again (footer "replay" link). */
  resetOnboarding: () => void;
}

const InterestsContext = createContext<InterestsContextValue | null>(null);

export function InterestsProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Standard "am I past hydration?" store read — no setState-in-effect dance.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const value = useMemo(
    () => ({
      interests: snapshot.interests,
      onboarded: snapshot.onboarded,
      hydrated,
      toggleInterest,
      completeOnboarding,
      resetOnboarding,
    }),
    [snapshot, hydrated]
  );

  return <InterestsContext.Provider value={value}>{children}</InterestsContext.Provider>;
}

export function useInterests(): InterestsContextValue {
  const ctx = useContext(InterestsContext);
  if (!ctx) throw new Error("useInterests must be used inside <InterestsProvider>");
  return ctx;
}

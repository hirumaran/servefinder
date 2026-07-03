"use client";

/**
 * Journal state shared across pages, persisted to this device's localStorage
 * only (see lib/experiences.ts for the privacy rationale — nothing uploads).
 *
 * Implementation: a tiny module-level store exposed via useSyncExternalStore.
 * The in-memory array is the source of truth (so the journal still works for
 * the current visit when storage is blocked), localStorage is the persistence
 * layer, and a "storage" listener keeps other tabs in sync. Server and
 * hydration renders see an empty journal; `hydrated` flips true with the
 * first client snapshot so pages can hold a skeleton instead of flashing
 * "empty journal" at someone with thirty logged hours.
 */

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

import {
  JOURNAL_STORAGE_KEY,
  makeExperienceId,
  parseJournal,
  serializeJournal,
  sortExperiences,
  totalHours as sumHours,
  type Experience,
  type NewExperience,
} from "./experiences";

const EMPTY: readonly Experience[] = [];

/** null = localStorage not read yet (also true for the whole server render). */
let entries: readonly Experience[] | null = null;
const listeners = new Set<() => void>();

function safeRead(): readonly Experience[] {
  try {
    return sortExperiences(parseJournal(window.localStorage.getItem(JOURNAL_STORAGE_KEY)));
  } catch {
    // Storage can be blocked (private mode, embedded webviews) — start empty
    // and run in-memory for the visit.
    return [];
  }
}

function persist(next: readonly Experience[]) {
  try {
    // An empty journal removes the key outright, so "delete everything"
    // leaves zero footprint in the browser.
    if (next.length === 0) {
      window.localStorage.removeItem(JOURNAL_STORAGE_KEY);
    } else {
      window.localStorage.setItem(JOURNAL_STORAGE_KEY, serializeJournal(next));
    }
  } catch {
    // Quota/blocked storage: the in-memory copy still works for this visit.
  }
}

function getSnapshot(): readonly Experience[] {
  if (entries === null) entries = safeRead();
  return entries;
}

function getServerSnapshot(): readonly Experience[] {
  return EMPTY;
}

function setEntries(next: readonly Experience[]) {
  entries = next;
  persist(next);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab edited the journal: refresh the cache, then re-render.
  // (key === null means localStorage.clear() from another tab.)
  function onStorage(event: StorageEvent) {
    if (event.key === JOURNAL_STORAGE_KEY || event.key === null) {
      entries = safeRead();
      listener();
    }
  }
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function addExperience(entry: NewExperience) {
  const full: Experience = {
    ...entry,
    id: makeExperienceId(),
    loggedAt: new Date().toISOString(),
  };
  setEntries(sortExperiences([...getSnapshot(), full]));
}

function updateExperience(id: string, patch: Partial<NewExperience>) {
  setEntries(
    sortExperiences(getSnapshot().map((e) => (e.id === id ? { ...e, ...patch } : e)))
  );
}

function removeExperience(id: string) {
  setEntries(getSnapshot().filter((e) => e.id !== id));
}

function clearJournal() {
  setEntries([]);
}

interface ExperiencesContextValue {
  /** All entries, most recent shift first. Empty until `hydrated` is true. */
  experiences: readonly Experience[];
  /** False on the server/hydration pass, before localStorage has been read. */
  hydrated: boolean;
  totalHours: number;
  addExperience: (entry: NewExperience) => void;
  updateExperience: (id: string, patch: Partial<NewExperience>) => void;
  removeExperience: (id: string) => void;
  /** Wipes every entry and removes the storage key entirely. */
  clearJournal: () => void;
}

const ExperiencesContext = createContext<ExperiencesContextValue | null>(null);

export function ExperiencesProvider({ children }: { children: React.ReactNode }) {
  const experiences = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Standard "am I past hydration?" store read — no setState-in-effect dance.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const value = useMemo(
    () => ({
      experiences,
      hydrated,
      totalHours: sumHours(experiences),
      addExperience,
      updateExperience,
      removeExperience,
      clearJournal,
    }),
    [experiences, hydrated]
  );

  return <ExperiencesContext.Provider value={value}>{children}</ExperiencesContext.Provider>;
}

export function useExperiences(): ExperiencesContextValue {
  const ctx = useContext(ExperiencesContext);
  if (!ctx) throw new Error("useExperiences must be used inside <ExperiencesProvider>");
  return ctx;
}

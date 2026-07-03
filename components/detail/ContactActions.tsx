"use client";

import { Check, Copy, Printer, Share2 } from "lucide-react";
import { useState } from "react";

import { CATEGORY_META } from "@/lib/categories";
import type { Opportunity } from "@/lib/types";

/** Assemble a plain-text block of the org's public contact info. */
function buildContactText(o: Opportunity): string {
  const lines = [
    o.name,
    CATEGORY_META[o.category].label,
    `${o.address.street}, ${o.address.city}, ${o.address.state} ${o.address.zip}`,
  ];
  if (o.contact.contactPerson) lines.push(`Contact: ${o.contact.contactPerson}`);
  if (o.contact.phone) lines.push(`Phone: ${o.contact.phone}`);
  if (o.contact.email) lines.push(`Email: ${o.contact.email}`);
  if (o.contact.website) lines.push(`Website: ${o.contact.website}`);
  return lines.join("\n");
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API can be unavailable (older browsers, non-HTTPS).
    // Fall back to a hidden textarea + execCommand.
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

/** Copy-contact-info, share, and print buttons for the detail page. */
export function ContactActions({ opportunity }: { opportunity: Opportunity }) {
  const [feedback, setFeedback] = useState<string | null>(null);

  function flash(message: string) {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 2500);
  }

  async function handleCopy() {
    const ok = await copyText(buildContactText(opportunity));
    flash(ok ? "Contact info copied!" : "Couldn't copy — select and copy the text above.");
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${opportunity.name} — ServeFinder`,
          text: `Volunteer opportunity: ${opportunity.name} (${opportunity.address.city}, ${opportunity.address.state})`,
          url,
        });
        return;
      } catch {
        return; // user closed the share sheet — not an error
      }
    }
    const ok = await copyText(url);
    flash(ok ? "Link copied!" : "Couldn't copy the link.");
  }

  const buttonClass =
    "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-600 hover:text-emerald-800";

  return (
    <div className="print-hide space-y-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={handleCopy} className={buttonClass}>
          {feedback?.includes("Contact") ? (
            <Check aria-hidden="true" className="size-4 text-emerald-700" />
          ) : (
            <Copy aria-hidden="true" className="size-4" />
          )}
          Copy contact info
        </button>
        <button type="button" onClick={handleShare} className={buttonClass}>
          <Share2 aria-hidden="true" className="size-4" />
          Share
        </button>
        <button type="button" onClick={() => window.print()} className={buttonClass}>
          <Printer aria-hidden="true" className="size-4" />
          Print
        </button>
      </div>
      {/* Announce copy results to screen readers too. */}
      <p aria-live="polite" className="min-h-5 text-sm font-medium text-emerald-800">
        {feedback}
      </p>
    </div>
  );
}

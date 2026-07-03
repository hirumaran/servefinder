import type { Metadata } from "next";

import { AdminClient } from "@/components/admin/AdminClient";
import { getAllOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "Admin — edit listings",
  // Operators only; keep it out of search engines.
  robots: { index: false, follow: false },
};

/**
 * Operator-only listing editor (gated by Basic Auth in proxy.ts).
 * Edits happen in the browser; the result is downloaded/saved back into
 * data/opportunities.json — see the workflow note inside the editor.
 */
export default function AdminPage() {
  return <AdminClient initialOpportunities={getAllOpportunities()} />;
}

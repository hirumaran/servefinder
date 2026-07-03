import {
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  Compass,
  HeartHandshake,
  Lock,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works & safety",
  description:
    "What Servd is (a finder that matches the causes you pick), how the 40-hour requirement works, and how to stay safe when contacting organizations.",
};

/** Static explainer: the 40-hour requirement, scope, safety, and disclaimers. */
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        How Servd works
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-slate-600">
        Most high schools require <strong>40 hours of community service</strong> to
        graduate. Finding places that actually welcome teen volunteers is the hard
        part — that&apos;s the one problem this site solves.
      </p>

      {/* ── Finder, not tracker ─────────────────────────────────────────── */}
      <section aria-labelledby="finder-heading" className="mt-10">
        <h2
          id="finder-heading"
          className="font-display flex items-center gap-2 text-2xl font-extrabold text-slate-900"
        >
          <Compass aria-hidden="true" className="size-6 text-emerald-700" />
          A finder — not a tracker
        </h2>
        <p className="mt-2 leading-relaxed text-slate-700">
          Servd is a <strong>directory</strong> at heart. We curate local volunteer
          opportunities and show you what each organization does, how far away it is,
          the age rules, and — crucially — whether it will sign off on your service
          hours. When you first arrive you pick the causes you care about, and the{" "}
          <Link
            href="/"
            className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
          >
            home page
          </Link>{" "}
          lines up matches from those picks. On purpose, this site has:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-slate-700 marker:text-emerald-600">
          <li>
            <strong>Causes that never leave your device</strong> — your picks are
            saved in this browser only, and the matches are computed right here too.
            Nothing is uploaded, and you can change or clear the picks any time from
            the home page.
          </li>
          <li>
            <strong>No accounts or sign-ups</strong> — nothing here to register for,
            ever. Your hours live on your school&apos;s signed form (or your
            counselor&apos;s system): that&apos;s the official record.
          </li>
          <li>
            <strong>No in-app applications or messaging</strong> — we don&apos;t sit
            between you and the organization. You contact them directly with the
            info on each listing.
          </li>
        </ul>
      </section>

      {/* ── Using the site ──────────────────────────────────────────────── */}
      <section aria-labelledby="steps-heading" className="mt-10">
        <h2
          id="steps-heading"
          className="font-display flex items-center gap-2 text-2xl font-extrabold text-slate-900"
        >
          <Search aria-hidden="true" className="size-6 text-emerald-700" />
          Using it well
        </h2>
        <ol className="mt-3 space-y-4">
          {[
            {
              title: "Search and filter",
              body: "Enter a ZIP (optional) to sort by distance, then filter by cause, age rules, virtual options, and orgs that verify hours. No car? Try the “Virtual OK” filter.",
            },
            {
              title: "Read the listing carefully",
              body: "Check the age minimum, requirements (some orgs need applications, orientations, or background checks), and the “how to get started” steps.",
            },
            {
              title: "Reach out — with a parent or guardian in the loop",
              body: "Call, email, or use the org's website. Say you're a student volunteer looking to earn service hours, and ask what the next step is.",
            },
            {
              title: "Confirm the hours process before you show up",
              body: "Ask directly: “Will you sign my school's service-hour form?” Bring the form to every shift — it's the official record of your hours.",
            },
          ].map(({ title, body }, index) => (
            <li key={title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-0.5 leading-relaxed text-slate-700">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Hour verification ───────────────────────────────────────────── */}
      <section
        aria-labelledby="verify-heading"
        className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
      >
        <h2
          id="verify-heading"
          className="font-display flex items-center gap-2 text-xl font-extrabold text-slate-900"
        >
          <BadgeCheck aria-hidden="true" className="size-6 text-emerald-700" />
          About the “Verifies hours” badge
        </h2>
        <p className="mt-2 leading-relaxed text-slate-700">
          Schools require documentation, so we ask every organization whether they
          sign service-hour forms and show it on each listing. But policies change and
          people move on —{" "}
          <strong>
            always re-confirm with the organization before your first shift
          </strong>
          . If a listing says hours aren&apos;t verified, check with your counselor
          whether an attendance email or certificate would count instead.
        </p>
      </section>

      {/* ── Safety ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="safety-heading" className="mt-10">
        <h2
          id="safety-heading"
          className="font-display flex items-center gap-2 text-2xl font-extrabold text-slate-900"
        >
          <ShieldCheck aria-hidden="true" className="size-6 text-emerald-700" />
          Staying safe
        </h2>
        <ul className="mt-3 space-y-3">
          {[
            {
              icon: HeartHandshake,
              text: "Involve a parent or guardian whenever you contact an organization — CC them on emails, or have them nearby for a first call or visit.",
            },
            {
              icon: Lock,
              text: "Share only what's needed: your name, age, school, and availability. A legitimate volunteer org will never ask for money or sensitive personal details.",
            },
            {
              icon: ClipboardList,
              text: "First visits should be to a staffed, public location during business hours. Trust your gut — if something feels off, leave and tell an adult.",
            },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4">
              <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-700" />
              <p className="leading-relaxed text-slate-700">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Privacy ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="privacy-heading" className="mt-10">
        <h2
          id="privacy-heading"
          className="font-display flex items-center gap-2 text-2xl font-extrabold text-slate-900"
        >
          <Lock aria-hidden="true" className="size-6 text-emerald-700" />
          Your privacy
        </h2>
        <p className="mt-2 leading-relaxed text-slate-700">
          No accounts, no cookies for tracking, no analytics that identify you. If you
          enter a ZIP or share your device location, it&apos;s used{" "}
          <strong>only inside your browser</strong> to compute distances and is gone
          when you close the tab. Saved hearts last for your current visit only. The
          causes you pick are different on purpose: they&apos;re kept in this
          browser&apos;s storage so they survive reloads — but they still{" "}
          <strong>never leave your device</strong>, and you can change or clear them
          any time from the home page.
        </p>
      </section>

      {/* ── Disclaimer ──────────────────────────────────────────────────── */}
      <section
        aria-labelledby="disclaimer-heading"
        className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5"
      >
        <h2
          id="disclaimer-heading"
          className="font-display flex items-center gap-2 text-xl font-extrabold text-slate-900"
        >
          <AlertTriangle aria-hidden="true" className="size-6 text-amber-700" />
          Things change — check before you go
        </h2>
        <p className="mt-2 leading-relaxed text-slate-700">
          We verify listings periodically (each shows a &quot;last verified&quot;
          date), but schedules, age rules, contact people, and hour-verification
          policies can change at any time. Servd can&apos;t guarantee any
          listing&apos;s accuracy or availability —{" "}
          <strong>
            confirm the details, especially hour sign-off, directly with the
            organization before showing up.
          </strong>
        </p>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/opportunities"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 text-base font-bold text-white hover:bg-emerald-800"
        >
          Start exploring opportunities
        </Link>
      </div>
    </div>
  );
}

import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  ExternalLink,
  Globe,
  Laptop,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  User,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactActions } from "@/components/detail/ContactActions";
import { DetailMapSection } from "@/components/detail/DetailMapSection";
import { DistanceNote } from "@/components/detail/DistanceNote";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_META } from "@/lib/categories";
import { ageLabel } from "@/lib/format";
import { getAllOpportunities, getOpportunityById } from "@/lib/opportunities";
import { TIME_COMMITMENT_LABELS } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Pre-render every listing at build time — the dataset is small and static. */
export function generateStaticParams() {
  return getAllOpportunities().map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const o = getOpportunityById(id);
  if (!o) return { title: "Opportunity not found" };
  return {
    title: o.name,
    description: o.description.slice(0, 155),
  };
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const o = getOpportunityById(id);
  if (!o) notFound();

  const meta = CATEGORY_META[o.category];
  const fullAddress = `${o.address.street}, ${o.address.city}, ${o.address.state} ${o.address.zip}`;
  // Plain directions URLs — just links, no map API keys or billing involved.
  const googleDirections = `https://www.google.com/maps/dir/?api=1&destination=${o.lat}%2C${o.lng}`;
  const appleDirections = `https://maps.apple.com/?daddr=${o.lat},${o.lng}`;
  const websiteHost = o.contact.website ? new URL(o.contact.website).hostname : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/opportunities"
        className="print-hide inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All opportunities
      </Link>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mt-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge colorClass={meta.badgeClass} icon={meta.icon}>
            {meta.label}
          </Badge>
          {o.verifiesHours && (
            <Badge colorClass="bg-emerald-100 text-emerald-900" icon={BadgeCheck}>
              Verifies hours
            </Badge>
          )}
          {o.isVirtual && (
            <Badge colorClass="bg-sky-100 text-sky-900" icon={Laptop}>
              Virtual option
            </Badge>
          )}
          {o.groupFriendly && (
            <Badge icon={Users} srLabel="Group friendly:">
              Groups welcome
            </Badge>
          )}
          <Badge icon={CalendarClock} srLabel="Time commitment:">
            {TIME_COMMITMENT_LABELS[o.timeCommitment]}
          </Badge>
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {o.name}
          </h1>
          <div className="print-hide">
            <FavoriteButton opportunityId={o.id} opportunityName={o.name} />
          </div>
        </div>

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-4" />
            {o.address.city}, {o.address.state}
          </span>
          <DistanceNote opportunity={o} />
        </p>
      </header>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_20rem] lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* ── Main column ──────────────────────────────────────────────── */}
        <div className="space-y-6">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="font-display text-xl font-bold text-slate-900">
              What you&apos;d be doing
            </h2>
            <p className="mt-2 leading-relaxed text-slate-700">{o.description}</p>
          </section>

          {/* Age & consent — always shown, even when there's no minimum. */}
          <section
            aria-labelledby="age-heading"
            className="rounded-2xl border border-stone-200 bg-white p-5"
          >
            <h2 id="age-heading" className="font-display text-lg font-bold text-slate-900">
              Age requirement
            </h2>
            <p className="mt-1 text-slate-700">
              <strong>{ageLabel(o.minAge)}.</strong>{" "}
              {o.parentalConsentRequired
                ? "A parent/guardian consent form is required for volunteers under 18."
                : "No parental consent form is listed — still, tell a parent or guardian before you reach out."}
            </p>
          </section>

          {/* Hour verification — the make-or-break detail for students. */}
          <section
            aria-labelledby="hours-heading"
            className={`rounded-2xl border p-5 ${
              o.verifiesHours
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <h2
              id="hours-heading"
              className="font-display flex items-center gap-2 text-lg font-bold text-slate-900"
            >
              {o.verifiesHours ? (
                <>
                  <BadgeCheck aria-hidden="true" className="size-5 text-emerald-700" />
                  Verifies service hours
                </>
              ) : (
                <>
                  <ShieldAlert aria-hidden="true" className="size-5 text-amber-700" />
                  Doesn&apos;t officially verify hours
                </>
              )}
            </h2>
            <p className="mt-1 leading-relaxed text-slate-700">
              {o.hoursNotes ??
                (o.verifiesHours
                  ? "Ask how they document volunteer hours when you first contact them."
                  : "Check with your school whether hours here can count before committing.")}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Schools require documentation — always confirm the sign-off process{" "}
              <em>before</em> your first shift.
            </p>
          </section>

          {o.requirements && o.requirements.length > 0 && (
            <section aria-labelledby="requirements-heading">
              <h2 id="requirements-heading" className="font-display text-xl font-bold text-slate-900">
                Requirements
              </h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-700 marker:text-emerald-600">
                {o.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="start-heading">
            <h2 id="start-heading" className="font-display text-xl font-bold text-slate-900">
              How to get started
            </h2>
            <ol className="mt-3 space-y-3">
              {o.howToStart.split("\n").map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* ── Sidebar: contact + location ──────────────────────────────── */}
        <aside className="space-y-4 md:sticky md:top-20 md:self-start">
          <section
            aria-labelledby="contact-heading"
            className="rounded-2xl border border-stone-200 bg-white p-5"
          >
            <h2 id="contact-heading" className="font-display text-lg font-bold text-slate-900">
              Contact them directly
            </h2>

            <ul className="mt-3 space-y-2.5 text-sm">
              {o.contact.contactPerson && (
                <li className="flex items-start gap-2.5">
                  <User aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  <span className="text-slate-700">{o.contact.contactPerson}</span>
                </li>
              )}
              {o.contact.phone && (
                <li className="flex items-start gap-2.5">
                  <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  <a
                    href={`tel:${o.contact.phone.replace(/[^\d+]/g, "")}`}
                    className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
                  >
                    {o.contact.phone}
                  </a>
                </li>
              )}
              {o.contact.email && (
                <li className="flex items-start gap-2.5">
                  <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  <a
                    href={`mailto:${o.contact.email}`}
                    className="font-semibold break-all text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
                  >
                    {o.contact.email}
                  </a>
                </li>
              )}
              {o.contact.website && websiteHost && (
                <li className="flex items-start gap-2.5">
                  <Globe aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-400" />
                  <a
                    href={o.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold break-all text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
                  >
                    {websiteHost}
                    <ExternalLink aria-hidden="true" className="size-3" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-4">
              <ContactActions opportunity={o} />
            </div>

            {/* Gentle safety reminder, exactly where the contact happens. */}
            <p className="mt-2 rounded-xl bg-stone-100 p-3 text-xs leading-relaxed text-slate-600">
              <strong className="text-slate-800">Before you reach out:</strong> tell a
              parent or guardian, and consider CC&apos;ing them on emails or having them
              nearby for calls. Never share more personal info than an org needs.
            </p>
          </section>

          <section
            aria-labelledby="location-heading"
            className="rounded-2xl border border-stone-200 bg-white p-5"
          >
            <h2 id="location-heading" className="font-display text-lg font-bold text-slate-900">
              Where it is
            </h2>
            <address className="mt-2 text-sm leading-relaxed text-slate-700 not-italic">
              {o.address.street}
              <br />
              {o.address.city}, {o.address.state} {o.address.zip}
            </address>

            <div className="mt-3">
              <DetailMapSection opportunity={o} />
            </div>

            <div className="print-hide mt-3 flex flex-wrap gap-2">
              <a
                href={googleDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800"
              >
                <MapPin aria-hidden="true" className="size-4" />
                Get directions
                <span className="sr-only"> to {fullAddress} (opens in a new tab)</span>
              </a>
              <a
                href={appleDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-800"
              >
                Apple Maps
                <span className="sr-only"> directions (opens in a new tab)</span>
              </a>
            </div>

            {o.isVirtual && (
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                This opportunity has a <strong>virtual option</strong> — the address is
                the organization&apos;s home base, but you may not need to travel at all.
              </p>
            )}
          </section>

          {o.lastVerified && (
            <p className="px-1 text-xs text-slate-500">
              Listing last verified by our team on{" "}
              <time dateTime={o.lastVerified}>
                {new Date(`${o.lastVerified}T00:00:00`).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              . Details can change — confirm with the organization.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

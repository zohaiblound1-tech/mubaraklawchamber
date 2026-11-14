import Link from 'next/link';

export function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <p className={`text-xs font-semibold tracking-[0.14em] uppercase ${onDark ? 'text-slate-400' : 'text-brass'}`}>{children}</p>
  );
}

/** Navy title band at the top of each inner page. */
export function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="on-dark bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-5 sm:pt-14 sm:pb-16">
        <Eyebrow onDark>{eyebrow}</Eyebrow>
        <h1 className="mt-3 font-serif text-[clamp(1.875rem,6vw,3rem)] leading-[1.15] font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {lead && <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{lead}</p>}
      </div>
    </section>
  );
}

/** Section title with an optional link to the page that has the full content. */
export function SectionHeading({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-navy sm:text-3xl">{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className="text-sm font-semibold text-navy underline decoration-line underline-offset-4 hover:decoration-navy">
          {link.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

export function MetricGrid({ cards }: { cards: { value: string; label: string; note: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((m) => (
        <div key={m.label} className="min-w-0 rounded-lg border border-line bg-white p-4 sm:p-5">
          <p className="font-serif text-[clamp(1.25rem,6vw,2.25rem)] leading-tight font-semibold tracking-tight break-words text-navy tabular-nums">
            {m.value}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">{m.label}</p>
          <p className="mt-0.5 text-xs text-muted">{m.note}</p>
        </div>
      ))}
    </div>
  );
}

export function PracticeCards({ items }: { items: { title: string; statute: string; body: string }[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((p) => (
        <article key={p.title} className="rounded-lg border border-line bg-white p-4 sm:p-6">
          <h3 className="font-serif text-xl font-semibold text-navy">{p.title}</h3>
          <p className="mt-1 text-xs font-medium text-brass">{p.statute}</p>
          <p className="mt-4 text-sm leading-6 text-ink">{p.body}</p>
        </article>
      ))}
    </div>
  );
}

/** Closing prompt at the end of an inner page, pointing to the next useful page. */
export function NextSteps({ links }: { links: { href: string; label: string; primary?: boolean }[] }) {
  return (
    <div className="mt-12 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:flex-wrap">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`btn px-4 py-2.5 ${l.primary ? 'btn-primary' : 'btn-quiet'}`}
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

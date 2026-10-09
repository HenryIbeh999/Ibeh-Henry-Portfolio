export function SectionHeader({ id, kicker, title }: { id?: string; kicker: string; title: string }) {
  return (
    <div id={id} className="mt-28 mb-8 flex items-end justify-between gap-6 border-b border-border pb-4">
      <div>
        <div className="text-[11px] uppercase tracking-[0.3em] text-primary">{kicker}</div>
        <h2 className="mt-2 text-2xl font-extrabold md:text-4xl">{title}</h2>
      </div>
      <div className="hidden h-px flex-1 bg-border md:block" />
    </div>
  );
}
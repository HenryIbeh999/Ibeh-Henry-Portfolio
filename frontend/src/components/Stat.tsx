export function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="px-4 py-3">
      <div className="text-2xl font-extrabold text-primary">{k}</div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{v}</div>
    </div>
  );
}
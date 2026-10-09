import { motion } from "motion/react";
import type { ReactNode } from "react";

export function StackCard({
  icon, title, items, highlight,
}: { icon: ReactNode; title: string; items: string[]; highlight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border p-5 ${highlight ? "border-border bg-surface-2" : "border-border bg-surface"}`}
    >
      <div className="flex items-center gap-2">
        <div className={`grid h-8 w-8 place-items-center rounded-md ${highlight ? "bg-primary text-primary-foreground" : "border border-border text-primary"}`}>
          {icon}
        </div>
        <div className="text-sm font-bold uppercase tracking-widest">{title}</div>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2 text-muted-foreground">
            <span className="text-primary">›</span> {it}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
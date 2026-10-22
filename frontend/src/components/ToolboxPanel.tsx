import { Code2, Cpu, Database, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import { TechMark } from "@/components/TechMark";
import { WindowFrame } from "@/components/WindowFrame";

export type ToolboxGroup = {
  title: string;
  /** Lucide icon name from the Sanity document. */
  icon?: string;
  /** The group the author leans on most — its label reads at full contrast. */
  highlight?: boolean;
  items: string[];
};

const GROUP_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Cpu,
  Code2,
  Database,
  Wrench,
};

/**
 * The toolbox: a legend of vendor marks, grouped the way the tools are used.
 *
 * Each tool is a socket — a recessed hairline frame with the vendor's own
 * mark stamped in it. The marks carry the only colour on the page besides the
 * accent, and they carry it as data: that is the colour the tool is printed
 * in, not decoration.
 */
export function ToolboxPanel({ groups }: { groups: ToolboxGroup[] }) {
  const total = groups.reduce((count, group) => count + group.items.length, 0);

  return (
    <WindowFrame path="~/toolbox" meta={`${total} tools`}>
      {groups.map((group) => {
        const Icon = GROUP_ICONS[group.icon ?? ""];
        return (
          <section key={group.title} className="border-b border-border p-4 last:border-b-0 md:p-5">
            <div className="flex items-center gap-3">
              {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : null}
              <h3
                className={`text-[11px] uppercase tracking-[0.25em] ${
                  group.highlight ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {group.title}
              </h3>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-2">
              {group.items.map((item) => (
                <div
                  key={item}
                  className="group flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <TechMark name={item} size={18} className="shrink-0" />
                  <span className="truncate text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </WindowFrame>
  );
}

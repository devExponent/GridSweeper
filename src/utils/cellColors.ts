// ============================================================
// utils/cellColors.ts — Number-to-color mapping for mine counts
// ============================================================

/** Returns a Tailwind text color class for a given adjacent-mine count */
export function getNumberColor(n: number): string {
  const colors: Record<number, string> = {
    1: "text-blue-400",
    2: "text-emerald-400",
    3: "text-red-400",
    4: "text-violet-400",
    5: "text-amber-500",
    6: "text-cyan-400",
    7: "text-pink-400",
    8: "text-slate-300",
  };
  return colors[n] ?? "text-slate-300";
}

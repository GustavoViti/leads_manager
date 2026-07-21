import { ReactNode } from "react";
import { PaginationControls } from "./PaginationControls";

interface ComparativoPanelProps {
  title: string;
  count: number;
  accent: "success" | "warning";
  table: ReactNode;
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onExportPage: () => void;
  onExportAll: () => void;
  exporting: boolean;
}

export function ComparativoPanel({
  title,
  count,
  accent,
  table,
  page,
  totalPages,
  startIndex,
  endIndex,
  onPrevious,
  onNext,
  onExportPage,
  onExportAll,
  exporting
}: ComparativoPanelProps) {
  const dotColor = accent === "success" ? "bg-accent-400" : "bg-amber-400";

  return (
    <div className="card flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-base-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
          <span className="rounded-full bg-base-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
            {count}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary !px-2.5 !py-1 text-xs" onClick={onExportPage} disabled={exporting || count === 0}>
            Exportar página
          </button>
          <button className="btn-secondary !px-2.5 !py-1 text-xs" onClick={onExportAll} disabled={exporting || count === 0}>
            Exportar tudo
          </button>
        </div>
      </div>

      <div className="max-h-[520px] overflow-auto">{table}</div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        total={count}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
}

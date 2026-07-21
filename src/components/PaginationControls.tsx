interface PaginationControlsProps {
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function PaginationControls({
  page,
  totalPages,
  startIndex,
  endIndex,
  total,
  onPrevious,
  onNext
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-base-border px-4 py-2.5 text-xs text-slate-400">
      <span>
        {total === 0 ? "0 de 0" : `${startIndex}–${endIndex} de ${total}`}
      </span>
      <div className="flex items-center gap-2">
        <button
          className="rounded-md border border-base-border px-2 py-1 text-slate-300 transition-colors hover:bg-base-800 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={onPrevious}
          disabled={page <= 1}
        >
          ← Anterior
        </button>
        <span className="tabular-nums">
          Página {page} de {totalPages}
        </span>
        <button
          className="rounded-md border border-base-border px-2 py-1 text-slate-300 transition-colors hover:bg-base-800 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}

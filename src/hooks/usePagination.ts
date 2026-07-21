import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 50;

export function usePagination<T>(rows: T[]) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

  // Se a lista encolher (ex: apos nova comparacao) e a pagina atual deixar de
  // existir, volta para a ultima pagina valida.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const startIndex = rows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, rows.length);

  return {
    page,
    setPage,
    totalPages,
    pageRows,
    pageSize: PAGE_SIZE,
    startIndex,
    endIndex,
    goToPrevious: () => setPage((p) => Math.max(1, p - 1)),
    goToNext: () => setPage((p) => Math.min(totalPages, p + 1))
  };
}

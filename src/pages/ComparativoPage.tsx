import { StatCard } from "@/components/StatCard";
import { SearchBar } from "@/components/SearchBar";
import { ConvertidosTable } from "@/components/ConvertidosTable";
import { FollowUpTable } from "@/components/FollowUpTable";
import { ComparativoPanel } from "@/components/ComparativoPanel";
import { Loading } from "@/components/Loading";
import { formatPercent } from "@/utils/format";
import { useComparativoData } from "@/hooks/useComparativoData";

export function ComparativoPage() {
  const {
    totalLinhas,
    stats,
    search,
    setSearch,
    loading,
    error,
    rodarComparativo,
    arquivoGrupoNome,
    exportando,
    convertidos,
    followUp,
    exportarConvertidosPagina,
    exportarConvertidosTudo,
    exportarFollowUpPagina,
    exportarFollowUpTudo
  } = useComparativoData();

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Comparativo</h1>
          <p className="mt-1 text-sm text-slate-400">
            Compare quem recebeu convite com os membros atuais do grupo e descubra quem realmente entrou.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button className="btn-primary" onClick={rodarComparativo} disabled={loading}>
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-6-4h6m2 9H7a2 2 0 01-2-2V4a2 2 0 012-2h6.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V18a2 2 0 01-2 2z" />
              </svg>
            )}
            Selecionar grupo atualizado
          </button>
          {arquivoGrupoNome && <span className="text-xs text-slate-500">Comparado com: {arquivoGrupoNome}</span>}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Convites enviados" value={stats.totalEnviados} tone="brand" />
          <StatCard label="Entraram no grupo" value={stats.totalEntraram} tone="success" />
          <StatCard label="Não entraram" value={stats.totalNaoEntraram} tone="warning" />
          <StatCard label="Taxa de conversão" value={formatPercent(stats.taxaConversao)} />
        </div>
      )}

      {stats && <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por nome ou telefone..." />}

      {loading ? (
        <Loading label="Comparando com o grupo atualizado..." />
      ) : (
        stats && (
          <div className="flex flex-col gap-6 lg:flex-row">
            <ComparativoPanel
              title="Convertidos"
              accent="success"
              table={<ConvertidosTable linhas={convertidos.paginacao.pageRows} />}
              count={convertidos.linhas.length}
              page={convertidos.paginacao.page}
              totalPages={convertidos.paginacao.totalPages}
              startIndex={convertidos.paginacao.startIndex}
              endIndex={convertidos.paginacao.endIndex}
              onPrevious={convertidos.paginacao.goToPrevious}
              onNext={convertidos.paginacao.goToNext}
              onExportPage={exportarConvertidosPagina}
              onExportAll={exportarConvertidosTudo}
              exporting={exportando}
            />

            <ComparativoPanel
              title="Precisam de follow-up"
              accent="warning"
              table={<FollowUpTable linhas={followUp.paginacao.pageRows} />}
              count={followUp.linhas.length}
              page={followUp.paginacao.page}
              totalPages={followUp.paginacao.totalPages}
              startIndex={followUp.paginacao.startIndex}
              endIndex={followUp.paginacao.endIndex}
              onPrevious={followUp.paginacao.goToPrevious}
              onNext={followUp.paginacao.goToNext}
              onExportPage={exportarFollowUpPagina}
              onExportAll={exportarFollowUpTudo}
              exporting={exportando}
            />
          </div>
        )
      )}

      {stats && (
        <p className="text-xs text-slate-500">
          {totalLinhas} convites enviados no total • {convertidos.linhas.length} convertidos • {followUp.linhas.length}{" "}
          precisam de follow-up.
        </p>
      )}
    </div>
  );
}

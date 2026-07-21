import { StatCard } from "@/components/StatCard";
import { SearchBar } from "@/components/SearchBar";
import { ComparativoTable } from "@/components/ComparativoTable";
import { Loading } from "@/components/Loading";
import { formatPercent } from "@/utils/format";
import { useComparativoData } from "@/hooks/useComparativoData";

export function ComparativoPage() {
  const {
    linhasFiltradas,
    totalLinhas,
    stats,
    search,
    setSearch,
    loading,
    error,
    rodarComparativo,
    arquivoGrupoNome,
    followUp,
    exportarFollowUp,
    exportando
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

      {stats && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por nome ou telefone..." />
          <button className="btn-secondary" onClick={exportarFollowUp} disabled={exportando || followUp.length === 0}>
            {exportando ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-slate-200" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Gerar lista de Follow-up ({followUp.length})
          </button>
        </div>
      )}

      {loading ? (
        <Loading label="Comparando com o grupo atualizado..." />
      ) : (
        <ComparativoTable linhas={linhasFiltradas} />
      )}

      {stats && (
        <p className="text-xs text-slate-500">
          Exibindo {linhasFiltradas.length} de {totalLinhas} convites enviados.
        </p>
      )}
    </div>
  );
}

import { StatCard } from "@/components/StatCard";
import { SearchBar } from "@/components/SearchBar";
import { LeadsTable } from "@/components/LeadsTable";
import { Loading } from "@/components/Loading";
import { useLeadsDataContext } from "@/context/LeadsDataContext";

export function LeadsPage() {
  const {
    loading,
    error,
    search,
    setSearch,
    leadsFiltrados,
    totalPendentes,
    totalEnviadosAteAgora,
    marcarComoEnviado,
    enviandoTelefone
  } = useLeadsDataContext();

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Leads</h1>
        <p className="mt-1 text-sm text-slate-400">
          Contatos extraídos que ainda não fazem parte do seu grupo e ainda não receberam convite.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Leads restantes" value={totalPendentes} tone="brand" />
        <StatCard label="Exibindo agora" value={leadsFiltrados.length} />
        <StatCard label="Convites enviados até agora" value={totalEnviadosAteAgora} tone="success" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por nome ou telefone..." />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {loading ? <Loading label="Carregando leads..." /> : (
        <LeadsTable leads={leadsFiltrados} onEnviar={marcarComoEnviado} enviandoTelefone={enviandoTelefone} />
      )}
    </div>
  );
}

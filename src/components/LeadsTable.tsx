import { LeadRow } from "@/types/config";
import { EmptyState } from "./EmptyState";

interface LeadsTableProps {
  leads: LeadRow[];
  onEnviar: (lead: LeadRow) => void;
  enviandoTelefone: string | null;
  onExcluir: (lead: LeadRow) => void;
  excluindoTelefone: string | null;
}

export function LeadsTable({ leads, onEnviar, enviandoTelefone, onExcluir, excluindoTelefone }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <EmptyState
        title="Nenhum lead pendente"
        description="Todos os leads já foram convidados, descartados, ou já fazem parte do grupo."
      />
    );
  }

  function handleExcluir(lead: LeadRow) {
    const confirmado = window.confirm(`Excluir "${lead.nome}" da lista de leads? Essa ação não pode ser desfeita.`);
    if (confirmado) onExcluir(lead);
  }

  return (
    <div className="overflow-hidden rounded-xl2 border border-base-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-base-850 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">Telefone</th>
            <th className="px-4 py-3 font-medium">Grupo de origem</th>
            <th className="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-border">
          {leads.map((lead) => (
            <tr key={lead.telefone} className="bg-base-900 transition-colors hover:bg-base-850">
              <td className="px-4 py-3 font-medium text-slate-100">{lead.nome}</td>
              <td className="px-4 py-3 font-mono text-slate-300">{lead.telefoneFormatado}</td>
              <td className="max-w-xs truncate px-4 py-3 text-slate-400" title={lead.grupoOrigem}>
                {lead.grupoOrigem}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    className="btn-success"
                    disabled={enviandoTelefone === lead.telefone}
                    onClick={() => onEnviar(lead)}
                  >
                    {enviandoTelefone === lead.telefone ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Enviado
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={excluindoTelefone === lead.telefone}
                    onClick={() => handleExcluir(lead)}
                  >
                    {excluindoTelefone === lead.telefone ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300/40 border-t-red-300" />
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

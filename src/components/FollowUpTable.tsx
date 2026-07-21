import { ComparativoRow } from "@/types/config";
import { formatDateTime } from "@/utils/format";
import { EmptyState } from "./EmptyState";

interface FollowUpTableProps {
  linhas: ComparativoRow[];
}

export function FollowUpTable({ linhas }: FollowUpTableProps) {
  if (linhas.length === 0) {
    return <EmptyState title="Ninguém pendente" description="Todo mundo que recebeu convite já entrou no grupo." />;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-base-850 text-xs uppercase tracking-wide text-slate-400">
        <tr>
          <th className="px-4 py-3 font-medium">Nome</th>
          <th className="px-4 py-3 font-medium">Telefone</th>
          <th className="px-4 py-3 font-medium">Data do convite</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-base-border">
        {linhas.map((linha) => (
          <tr key={linha.telefone} className="bg-base-900 transition-colors hover:bg-base-850">
            <td className="px-4 py-3 font-medium text-slate-100">{linha.nome}</td>
            <td className="px-4 py-3 font-mono text-slate-300">{linha.telefoneFormatado}</td>
            <td className="px-4 py-3 text-slate-400">{formatDateTime(linha.dataEnvio)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

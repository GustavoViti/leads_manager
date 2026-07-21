import { ComparativoRow } from "@/types/config";
import { formatDateTime } from "@/utils/format";

function escapeCsvField(value: string): string {
  if (value.includes(";") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Gera o conteudo CSV (separado por ";" para abrir corretamente no Excel PT-BR)
 * da lista de follow-up: pessoas que receberam convite e ainda nao entraram.
 */
export function buildFollowUpCsv(linhas: ComparativoRow[]): string {
  const cabecalho = ["Nome", "Telefone", "Data do Convite"];
  const corpo = linhas.map((l) =>
    [l.nome, l.telefoneFormatado, formatDateTime(l.dataEnvio)].map(escapeCsvField).join(";")
  );
  return [cabecalho.join(";"), ...corpo].join("\n");
}

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

/**
 * Gera o conteudo CSV da lista de convertidos: pessoas que receberam convite
 * e realmente entraram no grupo. Inclui a data do convite e a data de
 * confirmacao (quando entraram).
 */
export function buildConvertidosCsv(linhas: ComparativoRow[]): string {
  const cabecalho = ["Nome", "Telefone", "Data do Convite", "Data de Confirmação"];
  const corpo = linhas.map((l) =>
    [l.nome, l.telefoneFormatado, formatDateTime(l.dataEnvio), formatDateTime(l.confirmadoEm)].map(
      escapeCsvField
    ).join(";")
  );
  return [cabecalho.join(";"), ...corpo].join("\n");
}

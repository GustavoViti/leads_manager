/**
 * Formato EXATO de convertidos.json, com base no arquivo de exemplo anexado:
 * dicionario cuja chave e o telefone normalizado, guardando quando o convite
 * foi enviado e quando a entrada no grupo foi confirmada.
 */
export interface ConvertidoEntry {
  nome: string;
  dataEnvio: string;
  confirmadoEm: string;
}

export type ConvertidosMap = Record<string, ConvertidoEntry>;

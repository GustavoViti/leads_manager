/** Caminhos dos arquivos JSON configurados pelo usuario, persistidos entre sessoes.
 * enviados.json e convertidos.json NAO fazem parte daqui: eles sempre vivem na
 * pasta state/ ao lado do app e sao resolvidos automaticamente pelo processo main. */
export interface AppFilePaths {
  leadsPath: string | null;
  membrosPath: string | null;
}

export const EMPTY_PATHS: AppFilePaths = {
  leadsPath: null,
  membrosPath: null
};

/** Um lead pendente, ja calculado e pronto para exibir na Tela 1. */
export interface LeadRow {
  telefone: string;
  telefoneFormatado: string;
  nome: string;
  grupoOrigem: string;
}

export type StatusConversao = "entrou" | "pendente";

/** Uma linha da tela de comparativo (Tela 2). */
export interface ComparativoRow {
  telefone: string;
  telefoneFormatado: string;
  nome: string;
  status: StatusConversao;
  dataEnvio: string;
  confirmadoEm?: string;
}

export interface ComparativoStats {
  totalEnviados: number;
  totalEntraram: number;
  totalNaoEntraram: number;
  taxaConversao: number;
}

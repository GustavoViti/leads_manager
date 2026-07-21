/**
 * Formato EXATO de enviados.json: um dicionario cuja chave e o telefone
 * ja normalizado (somente digitos) e o valor guarda o controle do convite.
 * "mensagem" e "nome" sao opcionais pois nem todo registro existente os possui.
 */
export interface EnviadoEntry {
  status: string;
  em: string;
  mensagem?: string;
  nome?: string;
}

export type EnviadosMap = Record<string, EnviadoEntry>;

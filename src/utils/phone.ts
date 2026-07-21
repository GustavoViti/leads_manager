/**
 * Normaliza um numero de telefone removendo qualquer caractere de formatacao
 * (espacos, parenteses, tracos, "+", pontos, etc.), restando apenas os digitos.
 *
 * Exemplos:
 *   "+55 (11) 91417-4518"  -> "5511914174518"
 *   "+5511914174518"        -> "5511914174518"
 *   "55 11 9 1417 4518"     -> "5511914174518"
 *
 * TODA comparacao de telefone na aplicacao deve passar por esta funcao,
 * para que diferentes formatos de origem sejam tratados como equivalentes.
 */
export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

/**
 * Formata um telefone normalizado (somente digitos, com DDI 55) para exibicao,
 * no padrao +55 (DD) 9XXXX-XXXX. Se o numero nao seguir esse padrao (ex: DDI
 * diferente, numero fixo, tamanho fora do esperado), retorna o numero original
 * prefixado com "+" apenas para leitura, sem tentar adivinhar uma mascara.
 */
export function formatPhoneForDisplay(phone: string): string {
  const digits = normalizePhone(phone);

  // DDI 55 + DDD (2) + celular com 9 digitos = 13 digitos no total
  if (digits.length === 13 && digits.startsWith("55")) {
    const ddi = digits.slice(0, 2);
    const ddd = digits.slice(2, 4);
    const parte1 = digits.slice(4, 9);
    const parte2 = digits.slice(9, 13);
    return `+${ddi} (${ddd}) ${parte1}-${parte2}`;
  }

  // DDI 55 + DDD (2) + fixo com 8 digitos = 12 digitos no total
  if (digits.length === 12 && digits.startsWith("55")) {
    const ddi = digits.slice(0, 2);
    const ddd = digits.slice(2, 4);
    const parte1 = digits.slice(4, 8);
    const parte2 = digits.slice(8, 12);
    return `+${ddi} (${ddd}) ${parte1}-${parte2}`;
  }

  return digits ? `+${digits}` : "-";
}

/** Extrai o melhor nome disponivel de um contato, com fallback para o telefone. */
export function bestName(savedName: string | undefined, publicName: string | undefined, phoneFallback: string): string {
  const nome = (savedName && savedName.trim()) || (publicName && publicName.trim());
  return nome && nome.length > 0 ? nome : phoneFallback;
}

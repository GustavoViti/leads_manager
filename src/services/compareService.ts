import { WhatsAppContactList } from "@/types/contact";
import { EnviadosMap } from "@/types/enviado";
import { ConvertidosMap } from "@/types/convertido";
import { ComparativoRow, ComparativoStats, LeadRow } from "@/types/config";
import { bestName, formatPhoneForDisplay, normalizePhone } from "@/utils/phone";

/**
 * Tela 1: retorna somente os leads cujo telefone normalizado ainda NAO esta
 * entre os membros atuais do grupo E que ainda NAO tem nenhum registro em
 * enviados.json (seja porque ja recebeu convite -- status "enviado" -- seja
 * porque foi descartado manualmente -- status "descartado"). Assim que um
 * lead e marcado como "Enviado" ou "Excluido", ele passa a existir em
 * enviados.json e some desta lista. Tambem remove duplicados dentro do
 * proprio arquivo de leads (mesmo telefone aparecendo mais de uma vez).
 */
export function getLeadsPendentes(
  leads: WhatsAppContactList,
  membros: WhatsAppContactList,
  enviados: EnviadosMap
): LeadRow[] {
  const telefonesMembros = new Set(membros.map((m) => normalizePhone(m["Phone Number"])));
  const telefonesEnviados = new Set(Object.keys(enviados).map(normalizePhone));

  const vistos = new Set<string>();
  const resultado: LeadRow[] = [];

  for (const lead of leads) {
    const telefone = normalizePhone(lead["Phone Number"]);
    if (!telefone) continue;
    if (telefonesMembros.has(telefone)) continue;
    if (telefonesEnviados.has(telefone)) continue;
    if (vistos.has(telefone)) continue;

    vistos.add(telefone);
    resultado.push({
      telefone,
      telefoneFormatado: lead["Formatted Phone"] || formatPhoneForDisplay(telefone),
      nome: bestName(lead["Saved Name"], lead["Public Name"], formatPhoneForDisplay(telefone)),
      grupoOrigem: lead["Group Name"] || "-"
    });
  }

  return resultado;
}

/**
 * Tela 2: compara quem recebeu convite (enviados.json) contra o grupo
 * atualizado selecionado pelo usuario, determinando quem realmente entrou.
 * Tambem retorna quais telefones passaram a ser "novas confirmacoes" nesta
 * comparacao (para persistir em convertidos.json com confirmadoEm = agora).
 */
export function getComparativo(
  enviados: EnviadosMap,
  grupoAtualizado: WhatsAppContactList,
  convertidos: ConvertidosMap
): { linhas: ComparativoRow[]; stats: ComparativoStats; novasConfirmacoes: string[] } {
  const telefonesGrupo = new Set(grupoAtualizado.map((m) => normalizePhone(m["Phone Number"])));
  const contatosPorTelefone = new Map(
    grupoAtualizado.map((m) => [normalizePhone(m["Phone Number"]), m] as const)
  );

  const linhas: ComparativoRow[] = [];
  const novasConfirmacoes: string[] = [];
  let totalEntraram = 0;

  for (const [telefoneRaw, entrada] of Object.entries(enviados)) {
    const telefone = normalizePhone(telefoneRaw);
    const entrou = telefonesGrupo.has(telefone);
    const jaConvertido = convertidos[telefone];

    if (entrou) {
      totalEntraram += 1;
      if (!jaConvertido) {
        novasConfirmacoes.push(telefone);
      }
    }

    const contatoGrupo = contatosPorTelefone.get(telefone);
    const nome =
      entrada.nome ||
      (contatoGrupo ? bestName(contatoGrupo["Saved Name"], contatoGrupo["Public Name"], telefone) : "") ||
      jaConvertido?.nome ||
      formatPhoneForDisplay(telefone);

    linhas.push({
      telefone,
      telefoneFormatado: formatPhoneForDisplay(telefone),
      nome,
      status: entrou ? "entrou" : "pendente",
      dataEnvio: entrada.em,
      confirmadoEm: jaConvertido?.confirmadoEm ?? (entrou ? new Date().toISOString() : undefined)
    });
  }

  const totalEnviados = linhas.length;
  const totalNaoEntraram = totalEnviados - totalEntraram;
  const taxaConversao = totalEnviados > 0 ? (totalEntraram / totalEnviados) * 100 : 0;

  return {
    linhas,
    stats: { totalEnviados, totalEntraram, totalNaoEntraram, taxaConversao },
    novasConfirmacoes
  };
}

/** Filtra somente quem recebeu convite e ainda nao entrou, para a lista de follow-up. */
export function getFollowUp(linhas: ComparativoRow[]): ComparativoRow[] {
  return linhas.filter((l) => l.status === "pendente");
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePaths } from "@/context/PathsContext";
import { WhatsAppContactList } from "@/types/contact";
import { EnviadosMap } from "@/types/enviado";
import { LeadRow } from "@/types/config";
import { getLeadsPendentes } from "@/services/compareService";
import { getEnviadosPath, readEnviados, readLeads, readMembros, writeEnviados } from "@/services/dataService";
import { normalizePhone } from "@/utils/phone";

export function useLeadsData() {
  const { paths } = usePaths();

  const [leads, setLeads] = useState<WhatsAppContactList>([]);
  const [membros, setMembros] = useState<WhatsAppContactList>([]);
  const [enviados, setEnviados] = useState<EnviadosMap>({});
  const [enviadosPath, setEnviadosPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [enviandoTelefone, setEnviandoTelefone] = useState<string | null>(null);

  const carregarTudo = useCallback(async () => {
    if (!paths.leadsPath || !paths.membrosPath) return;
    setLoading(true);
    setError(null);
    try {
      const caminhoEnviados = await getEnviadosPath();
      setEnviadosPath(caminhoEnviados);

      const [leadsData, membrosData, enviadosData] = await Promise.all([
        readLeads(paths.leadsPath),
        readMembros(paths.membrosPath),
        readEnviados(caminhoEnviados)
      ]);

      setLeads(leadsData);
      setMembros(membrosData);
      setEnviados(enviadosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar os arquivos JSON.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths.leadsPath, paths.membrosPath]);

  useEffect(() => {
    carregarTudo();
  }, [carregarTudo]);

  const leadsPendentes = useMemo<LeadRow[]>(
    () => getLeadsPendentes(leads, membros, enviados),
    [leads, membros, enviados]
  );

  const leadsFiltrados = useMemo(() => {
    const termo = normalizePhone(search) || search.trim().toLowerCase();
    if (!termo) return leadsPendentes;

    return leadsPendentes.filter((lead) => {
      const nomeMatch = lead.nome.toLowerCase().includes(search.trim().toLowerCase());
      const telefoneMatch = search.trim() ? lead.telefone.includes(normalizePhone(search)) : false;
      return nomeMatch || telefoneMatch;
    });
  }, [leadsPendentes, search]);

  const marcarComoEnviado = useCallback(
    async (lead: LeadRow) => {
      if (!enviadosPath) return;
      setEnviandoTelefone(lead.telefone);
      try {
        const novoEnviados: EnviadosMap = {
          ...enviados,
          [lead.telefone]: {
            status: "enviado",
            em: new Date().toISOString(),
            nome: lead.nome
          }
        };
        await writeEnviados(enviadosPath, novoEnviados);
        setEnviados(novoEnviados);
      } finally {
        setEnviandoTelefone(null);
      }
    },
    [enviados, enviadosPath]
  );

  return {
    loading,
    error,
    search,
    setSearch,
    leadsFiltrados,
    totalPendentes: leadsPendentes.length,
    totalEnviadosAteAgora: Object.keys(enviados).length,
    marcarComoEnviado,
    enviandoTelefone,
    recarregar: carregarTudo
  };
}

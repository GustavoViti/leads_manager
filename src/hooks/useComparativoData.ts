import { useCallback, useMemo, useState } from "react";
import { ComparativoRow, ComparativoStats } from "@/types/config";
import { ConvertidosMap } from "@/types/convertido";
import { getComparativo } from "@/services/compareService";
import {
  getConvertidosPath,
  getEnviadosPath,
  exportCsvFile,
  pickGrupoAtualizadoFile,
  readConvertidos,
  readEnviados,
  readMembros,
  writeConvertidos
} from "@/services/dataService";
import { buildConvertidosCsv, buildFollowUpCsv } from "@/services/csvService";
import { usePagination } from "@/hooks/usePagination";

export function useComparativoData() {
  const [linhas, setLinhas] = useState<ComparativoRow[]>([]);
  const [stats, setStats] = useState<ComparativoStats | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [arquivoGrupoNome, setArquivoGrupoNome] = useState<string | null>(null);

  const rodarComparativo = useCallback(async () => {
    setError(null);

    const grupoPath = await pickGrupoAtualizadoFile();
    if (!grupoPath) return;

    setLoading(true);
    try {
      const enviadosPath = await getEnviadosPath();
      const convertidosPath = await getConvertidosPath();

      const [enviados, grupoAtualizado, convertidosAtuais] = await Promise.all([
        readEnviados(enviadosPath),
        readMembros(grupoPath),
        readConvertidos(convertidosPath)
      ]);

      const resultado = getComparativo(enviados, grupoAtualizado, convertidosAtuais);
      setLinhas(resultado.linhas);
      setStats(resultado.stats);
      setArquivoGrupoNome(grupoPath.split(/[\\/]/).pop() ?? grupoPath);

      // convertidos.json e sempre regravado ao final de cada comparacao.
      const agora = new Date().toISOString();
      const novoConvertidos: ConvertidosMap = { ...convertidosAtuais };
      for (const linha of resultado.linhas) {
        if (linha.status !== "entrou") continue;
        const jaExistia = convertidosAtuais[linha.telefone];
        novoConvertidos[linha.telefone] = {
          nome: linha.nome,
          dataEnvio: linha.dataEnvio,
          confirmadoEm: jaExistia?.confirmadoEm ?? agora
        };
      }
      await writeConvertidos(convertidosPath, novoConvertidos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar o comparativo.");
    } finally {
      setLoading(false);
    }
  }, []);

  const linhasFiltradas = useMemo(() => {
    if (!search.trim()) return linhas;
    const termoNome = search.trim().toLowerCase();
    const termoTelefone = search.replace(/\D/g, "");
    return linhas.filter((l) => {
      const nomeMatch = l.nome.toLowerCase().includes(termoNome);
      const telefoneMatch = termoTelefone ? l.telefone.includes(termoTelefone) : false;
      return nomeMatch || telefoneMatch;
    });
  }, [linhas, search]);

  const convertidosLinhas = useMemo(
    () => linhasFiltradas.filter((l) => l.status === "entrou"),
    [linhasFiltradas]
  );
  const followUpLinhas = useMemo(
    () => linhasFiltradas.filter((l) => l.status === "pendente"),
    [linhasFiltradas]
  );

  const convertidosPaginacao = usePagination(convertidosLinhas);
  const followUpPaginacao = usePagination(followUpLinhas);

  const exportar = useCallback(async (csvContent: string, prefixo: string) => {
    setExportando(true);
    try {
      await exportCsvFile(csvContent, prefixo);
    } finally {
      setExportando(false);
    }
  }, []);

  const exportarConvertidosPagina = useCallback(
    () => exportar(buildConvertidosCsv(convertidosPaginacao.pageRows), "convertidos-pagina"),
    [exportar, convertidosPaginacao.pageRows]
  );
  const exportarConvertidosTudo = useCallback(
    () => exportar(buildConvertidosCsv(convertidosLinhas), "convertidos-completo"),
    [exportar, convertidosLinhas]
  );
  const exportarFollowUpPagina = useCallback(
    () => exportar(buildFollowUpCsv(followUpPaginacao.pageRows), "follow-up-pagina"),
    [exportar, followUpPaginacao.pageRows]
  );
  const exportarFollowUpTudo = useCallback(
    () => exportar(buildFollowUpCsv(followUpLinhas), "follow-up-completo"),
    [exportar, followUpLinhas]
  );

  return {
    totalLinhas: linhas.length,
    stats,
    search,
    setSearch,
    loading,
    error,
    rodarComparativo,
    arquivoGrupoNome,
    exportando,
    convertidos: { linhas: convertidosLinhas, paginacao: convertidosPaginacao },
    followUp: { linhas: followUpLinhas, paginacao: followUpPaginacao },
    exportarConvertidosPagina,
    exportarConvertidosTudo,
    exportarFollowUpPagina,
    exportarFollowUpTudo
  };
}

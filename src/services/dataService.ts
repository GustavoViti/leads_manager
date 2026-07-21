import { WhatsAppContactList } from "@/types/contact";
import { EnviadosMap } from "@/types/enviado";
import { ConvertidosMap } from "@/types/convertido";
import { AppFilePaths, EMPTY_PATHS } from "@/types/config";

export async function getSavedPaths(): Promise<AppFilePaths> {
  const config = await window.api.getConfig();
  return { ...EMPTY_PATHS, ...config };
}

export async function savePaths(paths: AppFilePaths): Promise<void> {
  await window.api.setConfig(paths);
}

export async function pickLeadsFile(): Promise<string | null> {
  return window.api.selectJsonFile("Selecione o arquivo de leads (ex: fontenossa.json)");
}

export async function pickMembrosFile(): Promise<string | null> {
  return window.api.selectJsonFile("Selecione o arquivo de membros atuais do grupo");
}

export async function pickGrupoAtualizadoFile(): Promise<string | null> {
  return window.api.selectJsonFile("Selecione o JSON atualizado dos membros do grupo");
}

/**
 * enviados.json e convertidos.json sempre vivem na pasta state/, resolvida
 * automaticamente pelo processo main. Nao ha mais dialogo de "onde salvar":
 * o arquivo e localizado (ou criado, se ainda nao existir) direto.
 */
export async function getEnviadosPath(): Promise<string> {
  return window.api.getEnviadosPath();
}

export async function getConvertidosPath(): Promise<string> {
  return window.api.getConvertidosPath();
}

export async function readLeads(filePath: string): Promise<WhatsAppContactList> {
  return window.api.readJson<WhatsAppContactList>(filePath);
}

export async function readMembros(filePath: string): Promise<WhatsAppContactList> {
  return window.api.readJson<WhatsAppContactList>(filePath);
}

export async function readEnviados(filePath: string): Promise<EnviadosMap> {
  return window.api.readJson<EnviadosMap>(filePath);
}

export async function writeEnviados(filePath: string, data: EnviadosMap): Promise<void> {
  await window.api.writeJson(filePath, data);
}

export async function readConvertidos(filePath: string): Promise<ConvertidosMap> {
  return window.api.readJson<ConvertidosMap>(filePath);
}

export async function writeConvertidos(filePath: string, data: ConvertidosMap): Promise<void> {
  await window.api.writeJson(filePath, data);
}

export async function exportCsvFile(csvContent: string, prefixoNome: string): Promise<boolean> {
  const suggestedName = `${prefixoNome}-${new Date().toISOString().slice(0, 10)}.csv`;
  const savePath = await window.api.selectCsvSaveLocation(suggestedName);
  if (!savePath) return false;
  await window.api.writeCsv(savePath, csvContent);
  return true;
}

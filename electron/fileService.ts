import { app, dialog, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";

export interface AppFilePaths {
  leadsPath: string | null;
  membrosPath: string | null;
}

const CONFIG_FILE = path.join(app.getPath("userData"), "leads-manager-config.json");

/**
 * Pasta "state", onde enviados.json e convertidos.json sempre vivem.
 * Em desenvolvimento fica na raiz do projeto; em producao fica ao lado do
 * executavel instalado, para que o usuario consiga encontrar/fazer backup
 * facilmente.
 */
function getStateDir(): string {
  const baseDir = app.isPackaged ? path.dirname(app.getPath("exe")) : process.cwd();
  return path.join(baseDir, "state");
}

function ensureStateDir(): string {
  const dir = getStateDir();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Retorna o caminho fixo de enviados.json dentro de state/, criando o arquivo se nao existir. */
export function getEnviadosPath(): string {
  const dir = ensureStateDir();
  const filePath = path.join(dir, "enviados.json");
  if (!fs.existsSync(filePath)) {
    writeJsonFile(filePath, {});
  }
  return filePath;
}

/** Retorna o caminho fixo de convertidos.json dentro de state/, criando o arquivo se nao existir. */
export function getConvertidosPath(): string {
  const dir = ensureStateDir();
  const filePath = path.join(dir, "convertidos.json");
  if (!fs.existsSync(filePath)) {
    writeJsonFile(filePath, {});
  }
  return filePath;
}

/** Le a configuracao de caminhos (leads/membros) salva entre sessoes (ou retorna vazia). */
export function readConfig(): AppFilePaths {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return { leadsPath: null, membrosPath: null };
    }
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<AppFilePaths>;
    return { leadsPath: parsed.leadsPath ?? null, membrosPath: parsed.membrosPath ?? null };
  } catch {
    return { leadsPath: null, membrosPath: null };
  }
}

/** Grava a configuracao de caminhos (leads/membros). */
export function writeConfig(config: AppFilePaths): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}

/** Le e faz parse de um arquivo JSON qualquer do disco. */
export function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

/** Grava um objeto/array como JSON formatado no disco (gravacao atomica simples). */
export function writeJsonFile(filePath: string, data: unknown): void {
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpPath, filePath);
}

/** Abre um dialogo para o usuario escolher um arquivo .json existente. */
export async function selectJsonFile(window: BrowserWindow, title: string): Promise<string | null> {
  const result = await dialog.showOpenDialog(window, {
    title,
    properties: ["openFile"],
    filters: [{ name: "JSON", extensions: ["json"] }]
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
}

/** Abre um dialogo para o usuario escolher onde salvar o CSV exportado. */
export async function selectCsvSaveLocation(window: BrowserWindow, defaultName: string): Promise<string | null> {
  const result = await dialog.showSaveDialog(window, {
    title: "Exportar lista de follow-up",
    defaultPath: defaultName,
    filters: [{ name: "CSV", extensions: ["csv"] }]
  });
  if (result.canceled || !result.filePath) return null;
  return result.filePath;
}

/** Grava conteudo texto puro (usado para o CSV) no disco. */
export function writeTextFile(filePath: string, content: string): void {
  // BOM no inicio para o Excel reconhecer UTF-8 corretamente com acentos.
  fs.writeFileSync(filePath, `\uFEFF${content}`, "utf-8");
}

import { contextBridge, ipcRenderer } from "electron";
import type { AppFilePaths } from "./fileService";

const api = {
  getConfig: (): Promise<AppFilePaths> => ipcRenderer.invoke("config:get"),
  setConfig: (config: AppFilePaths): Promise<AppFilePaths> => ipcRenderer.invoke("config:set", config),

  getEnviadosPath: (): Promise<string> => ipcRenderer.invoke("state:getEnviadosPath"),
  getConvertidosPath: (): Promise<string> => ipcRenderer.invoke("state:getConvertidosPath"),

  readJson: <T,>(filePath: string): Promise<T> => ipcRenderer.invoke("json:read", filePath),
  writeJson: (filePath: string, data: unknown): Promise<boolean> => ipcRenderer.invoke("json:write", filePath, data),

  selectJsonFile: (title: string): Promise<string | null> => ipcRenderer.invoke("dialog:selectJsonFile", title),
  selectCsvSaveLocation: (defaultName: string): Promise<string | null> =>
    ipcRenderer.invoke("dialog:selectCsvSaveLocation", defaultName),

  writeCsv: (filePath: string, content: string): Promise<boolean> => ipcRenderer.invoke("csv:write", filePath, content)
};

contextBridge.exposeInMainWorld("api", api);

export type LeadsManagerApi = typeof api;

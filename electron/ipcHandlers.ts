import { ipcMain, BrowserWindow } from "electron";
import {
  readConfig,
  writeConfig,
  readJsonFile,
  writeJsonFile,
  selectJsonFile,
  selectCsvSaveLocation,
  writeTextFile,
  getEnviadosPath,
  getConvertidosPath,
  AppFilePaths
} from "./fileService";

export function registerIpcHandlers(getWindow: () => BrowserWindow | null): void {
  ipcMain.handle("config:get", () => readConfig());

  ipcMain.handle("config:set", (_event, config: AppFilePaths) => {
    writeConfig(config);
    return config;
  });

  ipcMain.handle("state:getEnviadosPath", () => getEnviadosPath());
  ipcMain.handle("state:getConvertidosPath", () => getConvertidosPath());

  ipcMain.handle("json:read", (_event, filePath: string) => {
    return readJsonFile(filePath);
  });

  ipcMain.handle("json:write", (_event, filePath: string, data: unknown) => {
    writeJsonFile(filePath, data);
    return true;
  });

  ipcMain.handle("dialog:selectJsonFile", async (_event, title: string) => {
    const win = getWindow();
    if (!win) return null;
    return selectJsonFile(win, title);
  });

  ipcMain.handle("dialog:selectCsvSaveLocation", async (_event, defaultName: string) => {
    const win = getWindow();
    if (!win) return null;
    return selectCsvSaveLocation(win, defaultName);
  });

  ipcMain.handle("csv:write", (_event, filePath: string, content: string) => {
    writeTextFile(filePath, content);
    return true;
  });
}

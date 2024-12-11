"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
    electron.contextBridge.exposeInMainWorld("myAPI", {
      closeWindow() {
        electron.ipcRenderer.send("closeWindow");
      },
      writeFile(data) {
        electron.ipcRenderer.send("writeFile", data);
      },
      readFile() {
        return electron.ipcRenderer.invoke("readFile");
      },
      heightWindow(data) {
        electron.ipcRenderer.send("heightWindow", data);
      },
      weatherRequest() {
        return electron.ipcRenderer.invoke("weatherRequest");
      }
    });
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}

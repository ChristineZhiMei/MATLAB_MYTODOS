import { ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('myAPI', {
      closeWindow() {
        ipcRenderer.send('closeWindow')
      },
      writeFile(data) {
        ipcRenderer.send('writeFile', data)
      },
      readFile() {
        return ipcRenderer.invoke('readFile')
      },
      heightWindow(data) {
        ipcRenderer.send('heightWindow', data)
      },
      weatherRequest() {
        return ipcRenderer.invoke('weatherRequest')
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

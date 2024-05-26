// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const {contextBridge, ipcRenderer, remote, shell} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    executeCommand: (command) => ipcRenderer.invoke('execute-command', command)
})

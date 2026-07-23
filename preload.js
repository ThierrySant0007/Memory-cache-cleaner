const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ramCleanerAPI', {
  cleanRam: () => ipcRenderer.invoke('clean-ram'),
  cleanTemp: () => ipcRenderer.invoke('clean-temp')
});


import { contextBridge, ipcRenderer } from "electron"

const versions = {}

for (const dependency of ["chrome", "node", "electron"]) {
	versions[dependency] = process.versions[dependency]
}

contextBridge.exposeInMainWorld("Versions", versions)

contextBridge.exposeInMainWorld("Butler", {
	getVersion: () => ipcRenderer.invoke("butler:Version.Get"),
	call: (method, params={}) => ipcRenderer.invoke("butler:call", method, params)
})


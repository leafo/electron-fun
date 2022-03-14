
import { contextBridge } from "electron"

const versions = {}

for (const dependency of ["chrome", "node", "electron"]) {
	versions[dependency] = process.versions[dependency]
}

contextBridge.exposeInMainWorld("Versions", versions)


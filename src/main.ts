const {app, BrowserWindow, ipcMain} = require("electron")
const path = require("path")

import { Client, Instance } from "butlerd";
import { createRequest, createNotification } from "butlerd/lib/support";

const makeButlerClient = async () => {
  const dbPath = path.join(app.getPath("userData"), "db", "butler.db")
  const itchioURL = "https://itch.io"

  let args = [
    "--dbpath", dbPath,
    "--address", itchioURL,
    "--user-agent", "itch/999.9",
    "--destiny-pid", `${process.pid}`,
    "--log"
  ];

  const butlerInstance = new Instance({
    butlerExecutable: "/home/leafo/bin/butler",
    log: console.log,
    args,
  })

  const client = await new Client(await butlerInstance.getEndpoint())

  client.onWarning((msg) => {
    logger.warn(`(butlerd) ${msg}`);
  });

  return client
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webviewTag: true,

      // ensure we are using secure settings
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  })

  win.loadFile('index.html')
  win.webContents.openDevTools()
}

app.on("web-contents-created", (event, contents) => {
  // console.log("Created web contents", `${contents.id}-${contents.getTitle()}`)
  contents.on("will-navigate", (event, url) => {
    console.log("navigating to url:" + url)
  })
})

app.whenReady().then(() => {
  createWindow()

  const butlerPromise = makeButlerClient()

  ipcMain.handle("butler:Version.Get", async () => {
    const butler = (await butlerPromise)
    return await butler.call(createRequest("Version.Get"), {})
  })

  ipcMain.handle("butler:call", async (e, method, params) => {
    const butler = (await butlerPromise)
    const res = await butler.call(createRequest(method), params)
    return res
  })

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})


app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit()
  }
})


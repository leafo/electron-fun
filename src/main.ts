const {app, BrowserWindow} = require("electron")

const path = require("path")

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
  console.log("Created web contents", `${contents.id}-${contents.getTitle()}`)
  contents.on("will-navigate", (event, url) => {
    console.log("navigating to url:" + url)
  })
})

app.whenReady().then(() => {
  createWindow()

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


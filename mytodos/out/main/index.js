"use strict";
const electron = require("electron");
const utils = require("@electron-toolkit/utils");
const path = require("path");
const fs = require("fs");
require("http");
const icon = path.join(__dirname, "./chunks/icon-CCOWVqfB.png");
const documentsPath = electron.app.getPath("documents");
const mytodosDataPath = path.join(documentsPath, "mytodosData");
console.log(mytodosDataPath);
const todoDatasIniPath = path.join(mytodosDataPath, "todoDatas.ini");
console.log(icon);
let mainWindow = null;
function createTray() {
  const template = [
    { label: "打开主窗口", click: () => {
      mainWindow.show();
    } },
    { type: "separator" },
    { label: "退出", click: () => {
      mainWindow.destroy();
      electron.app.quit();
    } }
  ];
  const menu = electron.Menu.buildFromTemplate(template);
  const tray = new electron.Tray(icon);
  tray.setTitle("MYTODOS");
  tray.setToolTip("MYTODOS");
  tray.setContextMenu(menu);
  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}
let noticeBody = "";
function notice() {
  const options = {
    icon,
    title: "通知",
    body: noticeBody
  };
  const notify = new electron.Notification(options);
  notify.show();
}
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    x: 50,
    Y: 50,
    show: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    icon,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
      // devTools: false // 禁用开发者工具
    }
  });
  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  createTray();
  electron.ipcMain.on("closeWindow", () => {
    electron.app.quit();
  });
  electron.ipcMain.on("writeFile", (_, data) => {
    if (!fs.existsSync(mytodosDataPath)) {
      fs.mkdirSync(mytodosDataPath, { recursive: true });
    }
    if (!fs.existsSync(todoDatasIniPath)) {
      fs.writeFileSync(todoDatasIniPath, "");
    }
    if (typeof data !== "string") {
      data = data.toString();
    }
    fs.writeFileSync(todoDatasIniPath, data);
  });
  electron.ipcMain.handle("readFile", () => {
    if (!fs.existsSync(mytodosDataPath)) {
      fs.mkdirSync(mytodosDataPath, { recursive: true });
    }
    if (!fs.existsSync(todoDatasIniPath)) {
      fs.writeFileSync(todoDatasIniPath, "");
    }
    return fs.readFileSync(todoDatasIniPath).toString();
  });
  electron.ipcMain.handle("weatherRequest", () => rRequest());
  electron.ipcMain.on("heightWindow", (_, data) => {
    if (typeof data !== "number") {
      data = parseInt(data);
      if (isNaN(data)) {
        data = 0;
      }
    }
    mainWindow.setResizable(true);
    mainWindow.setSize(440, data + 30);
    mainWindow.setResizable(false);
  });
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("mytodos");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
let weatherData = {
  ipdata: "",
  cityAdcode: "",
  cityName: "",
  reportTime: "",
  temperature: "",
  weather: ""
};
let key = "090dcba9180bc0acb345be887b18d1f3";
function ipRequest() {
  return new Promise((resolve) => {
    const http2 = require("http");
    let options = {
      hostname: "txt.go.sohu.com",
      port: 80,
      path: `/ip/soip?t=${Math.random()}`,
      method: "GET"
    };
    const regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    const req = http2.request(options, (res) => {
      res.on("data", (chunk) => {
        const matches = chunk.toString().match(regex);
        if (matches && matches.length > 0) {
          weatherData.ipdata = matches[0];
        } else {
          weatherData.ipdata = "unknown";
        }
        resolve(matches[0]);
      });
    });
    req.on("error", (e) => {
      console.error(`ip请求错误: ${e.message}`);
      resolve(`ip请求错误: ${e.message}`);
    });
    req.end();
  });
}
function cityRequest() {
  return new Promise((resolve) => {
    const http2 = require("http");
    let options = {
      hostname: "restapi.amap.com",
      port: 80,
      path: `/v3/ip?ip=${weatherData.ipdata}&key=${key}`,
      method: "GET"
    };
    const req = http2.request(options, (res) => {
      res.on("data", (chunk) => {
        chunk = JSON.parse(chunk);
        weatherData.cityAdcode = chunk.adcode;
        weatherData.cityName = chunk.city;
        resolve(chunk);
      });
    });
    req.on("error", (e) => {
      console.error(`city请求错误: ${e.message}`);
      resolve(`city请求错误: ${e.message}`);
    });
    req.end();
  });
}
function weatherRequest() {
  return new Promise((resolve) => {
    const http2 = require("http");
    let options = {
      hostname: "restapi.amap.com",
      port: 80,
      path: `/v3/weather/weatherInfo?key=${key}&city=${weatherData.cityAdcode}&extensions=base&output=JSON`,
      method: "GET"
    };
    const req = http2.request(options, (res) => {
      res.on("data", (chunk) => {
        try {
          chunk = JSON.parse(chunk);
          weatherData.weather = chunk.lives[0].weather;
          weatherData.reportTime = chunk.lives[0].reporttime.match(/\d\d:\d\d/)[0];
          weatherData.temperature = chunk.lives[0].temperature;
        } catch (e) {
          console.error(e);
        }
        resolve(chunk);
      });
    });
    req.on("error", (e) => {
      console.error(`weather请求错误: ${e.message}`);
      resolve(`weather请求错误: ${e.message}`);
    });
    req.end();
  });
}
function rRequest() {
  return new Promise(async (resolve) => {
    try {
      await ipRequest();
      await cityRequest();
      await weatherRequest();
      await weatherList();
    } catch (e) {
      console.error(e);
    }
    await resolve(weatherData);
  });
}
function weatherList() {
  if (weatherData.reportTime === "") {
    noticeBody = "天气查询失败";
    notice();
  } else {
    noticeBody = "天气查询成功";
    notice();
  }
  console.log(weatherData);
}

import { app, BrowserWindow, ipcMain, shell , Tray ,Menu , Notification ,nativeImage} from 'electron'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { join } from 'path'
import fs from 'fs'
import path from 'path'
import http from "http";
const documentsPath = app.getPath('documents')
const mytodosDataPath = path.join(documentsPath, 'mytodosData')
console.log(mytodosDataPath)
const todoDatasIniPath = path.join(mytodosDataPath, 'todoDatas.ini')
import icon from '../../build/icon.png?asset'
console.log(icon)
// const icon = nativeImage.createFromPath("src/renderer/src/assets/icon.ico")
// const icon = nativeImage.createFromPath("../../public/3d_128x128.ico")
// const icon = "O:\\electron\\mytodos\\public\\3d_128x128.ico"
let mainWindow = null
// 创建托盘
function createTray(){
  const template = [
    { label:"打开主窗口" , click: ()=>{mainWindow.show()} },
    { type:"separator" },
    { label:"退出" , click: ()=>{mainWindow.destroy();app.quit()} },
  ]
  const menu = Menu.buildFromTemplate(template)
  const tray = new Tray(icon)
  tray.setTitle('MYTODOS')
  tray.setToolTip('MYTODOS')
  tray.setContextMenu(menu)
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}
let noticeBody = ''
//系统通知
function notice(){
  const options = {
    icon: icon,
    title:"通知",
    body:noticeBody,
  }
  const notify = new Notification(options)
  notify.show()
}

function createWindow() {
  mainWindow = new BrowserWindow({
    x: 50,
    Y: 50,
    show: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // devTools: false // 禁用开发者工具
    }
  })

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  createTray()
  ipcMain.on('closeWindow', () => {
    app.quit()
  })
  ipcMain.on('writeFile', (_, data) => {
    if (!fs.existsSync(mytodosDataPath)) {
      fs.mkdirSync(mytodosDataPath, { recursive: true })
    }
    if (!fs.existsSync(todoDatasIniPath)) {
      fs.writeFileSync(todoDatasIniPath, '')
    }
    if (typeof data !== 'string') {
      data = data.toString()
    }
    fs.writeFileSync(todoDatasIniPath, data)
  })
  ipcMain.handle('readFile', () => {
    if (!fs.existsSync(mytodosDataPath)) {
      fs.mkdirSync(mytodosDataPath, { recursive: true })
    }
    if (!fs.existsSync(todoDatasIniPath)) {
      fs.writeFileSync(todoDatasIniPath, '')
    }
    return fs.readFileSync(todoDatasIniPath).toString()
  })
  ipcMain.handle('weatherRequest',()=>rRequest())
  ipcMain.on('heightWindow', (_, data) => {
    if (typeof data !== 'number') {
      data = parseInt(data)
      if (isNaN(data)) {
        data = 0 // 或者根据需要设置默认值
      }
    }
    mainWindow.setResizable(true)
    mainWindow.setSize(440, data + 30)
    mainWindow.setResizable(false)
  })
}
app.whenReady().then(() => {
  electronApp.setAppUserModelId('mytodos')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()


  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})





let weatherData = {
  ipdata: '',
  cityAdcode: '',
  cityName: '',
  reportTime: '',
  temperature: '',
  weather: '',
}
let key = '090dcba9180bc0acb345be887b18d1f3'
function ipRequest(){
  return new Promise((resolve) => {
    const http = require('http');
    let options = {
      hostname: 'txt.go.sohu.com',
      port: 80,
      path: `/ip/soip?t=${Math.random()}`,
      method: 'GET'
    }
    const regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
    const req = http.request(options, (res) => {
      res.on('data', (chunk) => {
        const matches = chunk.toString().match(regex)
        if (matches && matches.length > 0) {
          weatherData.ipdata = matches[0]
        } else {
          weatherData.ipdata = "unknown"
        }
        resolve(matches[0])
      })
    })
    req.on('error', (e) => {
      console.error(`ip请求错误: ${e.message}`);
      resolve(`ip请求错误: ${e.message}`)
    })
    req.end()
  })
}
function cityRequest(){
  return new Promise((resolve) => {
    const http = require('http');
    let options = {
      hostname: 'restapi.amap.com',
      port: 80,
      path: `/v3/ip?ip=${weatherData.ipdata}&key=${key}`,
      method: 'GET'
    }
    const req = http.request(options, (res) => {
      res.on('data', (chunk) => {
        chunk = JSON.parse(chunk);
        weatherData.cityAdcode = chunk.adcode
        weatherData.cityName = chunk.city
        resolve(chunk)
      })
    })
    req.on('error', (e) => {
      console.error(`city请求错误: ${e.message}`);
      resolve(`city请求错误: ${e.message}`)
    })
    req.end()
  })
}
function weatherRequest(){
  return new Promise((resolve) => {
    const http = require('http');
    let options = {
      hostname: 'restapi.amap.com',
      port: 80,
      path: `/v3/weather/weatherInfo?key=${key}&city=${weatherData.cityAdcode}&extensions=base&output=JSON`,
      method: 'GET'
    }
    const req = http.request(options, (res) => {
      res.on('data', (chunk) => {
        try{
          chunk = JSON.parse(chunk);
          weatherData.weather = chunk.lives[0].weather
          weatherData.reportTime = chunk.lives[0].reporttime.match(/\d\d:\d\d/)[0]
          weatherData.temperature = chunk.lives[0].temperature;
        }catch(e){
          console.error(e)
        }
        resolve(chunk)
      })
    })
    req.on('error', (e) => {
      console.error(`weather请求错误: ${e.message}`);
      resolve(`weather请求错误: ${e.message}`)
    })
    req.end()
  })
}
function rRequest(){
  return new Promise(async (resolve) => {
    try{
      await ipRequest()
      await cityRequest()
      await weatherRequest()
      await weatherList()
    }catch(e){
      console.error(e)
    }
    await resolve(weatherData)
  })
}
function weatherList(){
  if(weatherData.reportTime === ''){
    noticeBody = "天气查询失败"
    notice()
  }
  else{
    noticeBody = "天气查询成功"
    notice()
  }
  console.log(weatherData)
}

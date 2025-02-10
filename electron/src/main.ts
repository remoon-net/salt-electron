import { app, BrowserWindow, Menu, MenuItem, nativeImage, Tray } from 'electron'
import path from 'node:path'
import started from 'electron-squirrel-startup'
import serve from 'electron-serve'
import windowStateKeeper from 'electron-window-state'
import plugins from './rt/plugins'
import { setupCapacitorElectronPlugins } from 'cap-electron'
import xhe, { init as xheInit } from './xhe'
import isDev from 'electron-is-dev'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit()
}

const loadURL = serve({
	directory: path.join(app.getAppPath(), `./app`),
})

const iconPath = path.join(
	app.getAppPath(),
	'assets',
	process.platform === 'win32' ? 'salt-icon.ico' : 'salt-icon.png',
)
const icon = nativeImage.createFromPath(iconPath)

const createWindow = async () => {
	const mainWindowState = windowStateKeeper({
		defaultWidth: 460,
		defaultHeight: 745,
	})

	// Create the browser window.
	const mainWindow = new BrowserWindow({
		icon: icon,
		minWidth: 460,
		minHeight: 745,
		width: mainWindowState.width,
		height: mainWindowState.height,
		x: mainWindowState.x,
		y: mainWindowState.y,
		webPreferences: {
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	})
	mainWindowState.manage(mainWindow)

	await loadURL(mainWindow)

	mainWindow.on('close', (e) => {
		if (quitFromTray) {
			return
		}
		e.preventDefault()
		mainWindow.hide()
	})

	return mainWindow
}

let mw: BrowserWindow

void (async function main() {
	if (!app.requestSingleInstanceLock()) {
		app.quit()
		return
	}

	await app.whenReady()

	await xheInit
	await xhe.get({ selector: 'status' })
	setupCapacitorElectronPlugins(plugins)

	mw = await createWindow()
	// Open the DevTools.
	if (isDev) {
		mw.webContents.openDevTools()
	}

	tray()
})().catch((err) => {
	console.error(err)
	app.quit()
})

// 只允许一个实例
app.on('second-instance', () => {
	showMainWindow()
})

let quitFromTray = false
function tray() {
	const tray = new Tray(icon)
	tray.setToolTip(app.getName())
	tray.on('click', toggleMainWindow)
	// tray.on('double-click', showMainWindow)
	tray.setContextMenu(
		Menu.buildFromTemplate([
			new MenuItem({
				label: 'Quit App',
				click: () => {
					quitFromTray = true
					app.quit()
				},
			}),
		]),
	)
}

function toggleMainWindow() {
	if (!mw) {
		return
	}
	if (mw.isVisible()) {
		mw.hide()
	} else {
		showMainWindow()
	}
}

function showMainWindow() {
	mw.show()
	mw.focus()
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', async () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mw.isDestroyed()) {
		mw = await createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

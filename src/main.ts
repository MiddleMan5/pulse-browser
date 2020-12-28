/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import "core-js/stable";
import "regenerator-runtime/runtime";
import path from "path";
import { app, BrowserWindow, shell, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import MenuBuilder from "./menu";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GLOBAL = global as any;

GLOBAL.splashWorkerWindow = null;

const showWorkerWindow = false;

export default class AppUpdater {
    constructor() {
        log.transports.file.level = "info";
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === "production") {
    const sourceMapSupport = require("source-map-support");
    sourceMapSupport.install();
}

if (process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true") {
    require("electron-debug")();
}

const installExtensions = async () => {
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload
        )
        .catch(console.log);
};

const createWindow = async () => {
    if (process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true") {
        await installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, "resources")
        : path.join(__dirname, "../resources");

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    function createSplashWorker() {
        // console.log('Dev ' + process.env.NODE_ENV + ' worker ' + showWorkerWindow);
        GLOBAL.splashWorkerWindow = new BrowserWindow({
            show: showWorkerWindow,
            x: 0,
            y: 0,
            width: showWorkerWindow ? 800 : 1,
            height: showWorkerWindow ? 600 : 1,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
            },
        });

        GLOBAL.splashWorkerWindow.loadURL(`file://${__dirname}/worker.html`);
    }

    createSplashWorker();

    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        icon: getAssetPath("icon.png"),
        webPreferences: {
            spellcheck: true,
            nodeIntegration: true,
            webviewTag: true,
            enableRemoteModule: true,
        },
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    mainWindow.webContents.on("did-finish-load", () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    mainWindow.webContents.on("new-window", (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    GLOBAL.splashWorkerWindow.webContents.on("crashed", () => {
        try {
            GLOBAL.splashWorkerWindow.close();
            GLOBAL.splashWorkerWindow = null;
        } catch (err) {
            console.warn("Error closing the splash window. " + err);
        }
        createSplashWorker();
    });

    ipcMain.on("worker", (event, arg) => {
        // console.log('worker event in main.' + arg.result.length);
        if (mainWindow) {
            mainWindow.webContents.send(arg.id, arg);
        }
    });

    ipcMain.on("setSplashVisibility", (event, arg) => {
        // worker window needed to be visible for the PDF tmb generation
        // console.log('worker event in main: ' + arg.visibility);
        if (GLOBAL.splashWorkerWindow && arg.visibility) {
            GLOBAL.splashWorkerWindow.show();
            // arg.visibility ? global.splashWorkerWindow.show() : global.splashWorkerWindow.hide();
        }
    });

    ipcMain.on("app-data-path-request", (event) => {
        event.returnValue = app.getPath("appData"); // eslint-disable-line
    });

    ipcMain.on("app-version-request", (event) => {
        event.returnValue = app.getVersion(); // eslint-disable-line
    });

    ipcMain.on("app-dir-path-request", (event) => {
        event.returnValue = path.join(__dirname, ""); // eslint-disable-line
    });

    // ipcMain.on('relaunch-app', reloadApp);

    ipcMain.on("quit-application", () => {
        app.quit();
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.whenReady().then(createWindow).catch(console.log);

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

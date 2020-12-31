/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 */
import "core-js/stable";
import "regenerator-runtime/runtime";
import path from "path";
import { app, BrowserWindow, shell, ipcMain, IpcMainEvent } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import MenuBuilder from "./menu";
import { IpcRequest, channels } from "./worker";
import url from "url";

// Source: https://blog.logrocket.com/electron-ipc-response-request-architecture-with-typescript/

// TODO: The webworker must construct the script to register channels IN THE OTHER WINDOW
// TODO: Using a seperate browser window allows us to import native modules

/* Structure example:
main: {
    ipc: [
        worker1: [
            channel1, channel2,
        ],
        worker2: [
            channel3
        ]
    ]
}
// ipc is the interface that knows about all of the channels, workers represent threads, channels are named functions
// Note: channels should be unique (implies no load balancing)
*/

export class Worker {
    protected window?: BrowserWindow;

    // FIXME: This implies one channel per worker
    constructor() {
        this.window = new BrowserWindow({
            show: false,
            x: 0,
            y: 0,
            width: 1024,
            height: 728,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
            },
        });

        this.window.on("closed", () => {
            this.window = undefined;
        });
        this.window
            .loadURL(
                url.format({
                    pathname: path.join(__dirname, "worker.html"),
                    protocol: "file:",
                    slashes: true,
                })
            )
            .then(() => this.init())
            .catch(console.error);
    }

    // FIXME: get return type from channel
    public send(channel: string, request: IpcRequest): Promise<unknown> {
        // // Autogenerate request channel
        const responseChannel = `${channel}_response_${new Date().getTime()}`;
        // return result;
        const result = new Promise((resolve) => {
            ipcMain.once(responseChannel, (event, response) => {
                console.log("Got response:", response);
                resolve(response);
            });
        });
        this.window?.webContents.send(channel, { responseChannel, args: request?.args });
        return result;
    }

    protected init() {
        // Inter-worker communication relay
        channels.forEach((channel) => {
            // Relay all messages through main
            ipcMain.on(channel.name, (event: IpcMainEvent, request: IpcRequest) => {
                if (this.window) {
                    // TODO: Standardize this naming scheme somewhere
                    const workerChannelName = `${this.window.id}.${channel.name}`;
                    const responseChannel = request?.responseChannel;
                    this.send(workerChannelName, request)
                        .then((value) => {
                            if (responseChannel) {
                                event.sender.send(responseChannel, value);
                            }
                        })
                        .catch(console.error);
                }
            });
        });
    }
}

export interface MainConfig {
    nodeEnv: "development" | "production";
    resourcePath: string;
}

export class Main {
    protected mainWindow?: BrowserWindow;
    protected workers: Worker[] = [];

    constructor(config: MainConfig) {
        if (config.nodeEnv === "production") {
            const sourceMapSupport = require("source-map-support");
            sourceMapSupport.install();
        } else {
            require("electron-debug")();
        }

        // Auto updater
        // TODO: Probably can get rid of this for now
        log.transports.file.level = "info";
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify().catch(console.error);

        // Event Handlers

        // Initialize app window
        app.whenReady().then(() => {
            this.init(config).catch(console.error);
        });

        // Re-open window
        app.on("activate", () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.mainWindow === null) {
                this.init(config).catch(console.error);
            }
        });

        // All windows closed
        app.on("window-all-closed", () => {
            // Respect the OSX convention of having the application in memory even
            // after all windows have been closed
            if (process.platform !== "darwin") {
                app.quit();
            }
        });
    }

    // Install adtional browser extensions
    protected async installExtensions() {
        const installer = require("electron-devtools-installer");
        const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
        const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

        return installer
            .default(
                extensions.map((name) => installer[name]),
                forceDownload
            )
            .catch(console.log);
    }

    // Asynchronous initialization to be done after window loads
    protected async init(config: MainConfig) {
        if (config.nodeEnv === "development") {
            await this.installExtensions();
        }

        // TODO: assets, hierarchical paths
        const resourcePath = (...paths: string[]): string => {
            return path.join(config.resourcePath, ...paths);
        };

        if (this.mainWindow == null) {
            this.mainWindow = new BrowserWindow({
                show: false,
                width: 1024,
                height: 728,
                icon: resourcePath("icon.png"),
                webPreferences: {
                    webviewTag: true,
                    spellcheck: true,
                    nodeIntegration: true,
                    nodeIntegrationInWorker: true,
                    enableRemoteModule: true,
                },
            });

            // TODO: I'd love to get rid of html files entirely
            this.mainWindow.loadURL(`file://${__dirname}/index.html`).catch(console.error);

            this.mainWindow.on("ready-to-show", () => {
                if (this.mainWindow) {
                    this.mainWindow.show();
                    this.mainWindow.focus();
                } else {
                    // NOTE: Probably don't need an exception, window was "closed" before "ready-to-show"
                    throw new Error('"mainWindow" is not defined');
                }
            });

            this.mainWindow.on("closed", () => {
                this.mainWindow = undefined;
            });

            // Electron context menus
            const menuBuilder = new MenuBuilder(this.mainWindow);
            menuBuilder.buildMenu();

            // Open urls in the user's browser
            this.mainWindow.webContents.on("new-window", (event, url) => {
                event.preventDefault();
                shell.openExternal(url).catch(console.error);
            });

            // Start web workers
            this.workers.push(new Worker());
        }
    }
}

// Start main process
new Main({ nodeEnv: "development", resourcePath: "../resources" });

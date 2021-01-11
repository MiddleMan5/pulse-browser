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

// Get full path to public/ file
const publicResource = (...src: string[]) => path.join(__dirname, "..", "public", ...src);

// Source: https://blog.logrocket.com/electron-ipc-response-request-architecture-with-typescript/

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

// Using a seperate browser window for worker processes allows us to import native modules
export class WorkerWindow {
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
                    pathname: publicResource("worker.html"),
                    protocol: "file:",
                    slashes: true,
                })
            )
            .then(() => this.init())
            .catch((err) => console.error(err));
    }

    // FIXME: get return type from channel
    public send(channel: string, request: IpcRequest): Promise<unknown> {
        // // Autogenerate request channel
        const responseChannel = `${channel}_response_${new Date().getTime()}`;
        // return result;
        const result = new Promise((resolve) => {
            ipcMain.once(responseChannel, (event, response) => {
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
                        .catch((err) => console.error(err));
                }
            });
            ipcMain.on("log:debug", (event: IpcMainEvent, request: IpcRequest<any[]>) => {
                if (this.window) {
                    console.info.apply(null, ["log:debug", ...(request?.args ?? [])]);
                }
            });
            ipcMain.on("log:info", (event: IpcMainEvent, request: IpcRequest<any[]>) => {
                if (this.window) {
                    console.info.apply(null, ["log:info", ...(request?.args ?? [])]);
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
    protected workers: WorkerWindow[] = [];

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
        autoUpdater.checkForUpdatesAndNotify().catch((err) => console.error(err));

        // Event Handlers

        // Initialize app window
        app.whenReady()
            .then(() => {
                this.init(config).catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));

        // Re-open window
        app.on("activate", () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.mainWindow === null) {
                this.init(config).catch((err) => console.error(err));
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
            this.mainWindow
                .loadURL(
                    url.format({
                        pathname: publicResource("index.html"),
                        protocol: "file:",
                        slashes: true,
                    })
                )
                .catch((err) => console.error(err));

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
            this.mainWindow.webContents.on("new-window", (event, linkUrl) => {
                event.preventDefault();
                shell.openExternal(linkUrl).catch((err) => console.error(err));
            });

            // Start web workers
            this.workers.push(new WorkerWindow());
        }
    }
}

const nodeEnv = process.env?.NODE_ENV === "development" ? "development" : "production";

// Start main process
new Main({ nodeEnv: nodeEnv, resourcePath: publicResource() });

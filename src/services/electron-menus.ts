import i18n from "./i18n";
import PlatformIO from "./platform-io";
import AppConfig from "../config";

const ipcRenderer = window.require("electron");

export default function buildDesktopMenu(mainPageProps: any) {
    if (!AppConfig.isElectron) {
        return;
    }

    ipcRenderer.on("file", (event, arg) => {
        // console.log('Global events: ' + arg);
        switch (arg) {
            case "new-text-file":
                mainPageProps.toggleCreateFileDialog();
                break;
            case "open-search":
                mainPageProps.openSearchPanel();
                break;
            case "audio":
                // console.log('showAudioRecordingDialog');
                break;
            case "next-file": {
                mainPageProps.openNextFile();
                break;
            }
            case "previous-file": {
                mainPageProps.openPrevFile();
                break;
            }
            default:
                return false;
        }
    });

    ipcRenderer.on("play-pause", (event, arg) => {
        // Create the event.
        const audioEvent = new CustomEvent("toggle-resume", { detail: "" });
        window.dispatchEvent(audioEvent);
    });

    const templateDefault = [
        {
            label: i18n.t("core:file"),
            submenu: [
                /* {
          label: i18n.t('core:openNewInstance'),
          accelerator: '',
          click: () => {
            // ipcRenderer.send('new-win', 'newWin');
          }
        }, */
                /* {
          type: 'separator'
        }, */
                {
                    label: i18n.t("core:newFileNote"),
                    // accelerator: 'CommandOrControl+Alt+N',
                    click: () => {
                        mainPageProps.toggleCreateFileDialog();
                    },
                },
                /* {
          label: i18n.t('core:createMarkdown'),
          accelerator: '',
          // click: createMDFile
        },
        {
          label: i18n.t('core:createRichTextFile'),
          accelerator: '',
          // click: createHTMLFile
        },
        */
                {
                    type: "separator",
                },
                {
                    label: i18n.t("core:createDirectory"),
                    accelerator: "",
                    click: () => {
                        mainPageProps.showCreateDirectoryDialog();
                    },
                },
                {
                    type: "separator",
                },
                /* {
          label: i18n.t('core:saveFile'),
          accelerator: mainPageProps.keyBindings.saveDocument,
          click: () => {
            mainPageProps.saveFile();
          }
        },
        {
          type: 'separator'
        }, */
                /* {
          label: i18n.t('core:closeWin'),
          accelerator: '',
          click: (item, focusedWindow) => {
            focusedWindow.destroy();
          }
        }, */
                {
                    label: i18n.t("core:exitApp"),
                    accelerator: "CmdOrCtrl+Q",
                    click: PlatformIO.quitApp,
                },
            ],
        },
        {
            label: i18n.t("core:edit"),
            submenu: [
                {
                    label: i18n.t("core:undo"),
                    accelerator: "CmdOrCtrl+Z",
                    role: "undo",
                },
                {
                    label: i18n.t("core:redo"),
                    accelerator: "Shift+CmdOrCtrl+Z",
                    role: "redo",
                },
                {
                    type: "separator",
                },
                {
                    label: i18n.t("core:cut"),
                    accelerator: "CmdOrCtrl+X",
                    role: "cut",
                },
                {
                    label: i18n.t("core:copy"),
                    accelerator: "CmdOrCtrl+C",
                    role: "copy",
                },
                {
                    label: i18n.t("core:paste"),
                    accelerator: "CmdOrCtrl+V",
                    role: "paste",
                },
                {
                    label: i18n.t("core:selectAll"),
                    accelerator: "CmdOrCtrl+A",
                    role: "selectall",
                },
            ],
        },
        {
            label: i18n.t("core:view"),
            submenu: [
                {
                    label: i18n.t("core:showLocationManager"),
                    accelerator: mainPageProps.keyBindings.showLocationManager,
                    click: () => {
                        mainPageProps.openLocationManagerPanel();
                    },
                },
                {
                    label: i18n.t("core:showTagLibrary"),
                    accelerator: mainPageProps.keyBindings.showTagLibrary,
                    click: () => {
                        mainPageProps.openTagLibraryPanel();
                    },
                },
                {
                    label: i18n.t("core:showSearch"),
                    accelerator: mainPageProps.keyBindings.showSearch,
                    click: () => {
                        mainPageProps.openSearchPanel();
                    },
                },
                {
                    label: i18n.t("core:showDevTools"),
                    accelerator: mainPageProps.keyBindings.openDevTools,
                    click: (item, focusedWindow) => {
                        focusedWindow.toggleDevTools();
                    },
                },
                {
                    label: i18n.t("core:reloadApplication"),
                    accelerator: mainPageProps.keyBindings.reloadApplication,
                    click: (item, focusedWindow) => {
                        // ipcRenderer.send('relaunch-app', 'relaunch');
                        focusedWindow.webContents.reload();
                    },
                },
                {
                    type: "separator",
                },
                {
                    label: i18n.t("core:toggleFullScreen"),
                    accelerator: mainPageProps.keyBindings.toggleFullScreen,
                    click: (item, focusedWindow) => {
                        if (focusedWindow.isFullScreen()) {
                            document.exitFullscreen();
                            focusedWindow.setFullScreen(false);
                        } else {
                            focusedWindow.setFullScreen(true);
                        }
                    },
                },
                {
                    type: "separator",
                },
                {
                    label: i18n.t("core:settings"),
                    click: () => {
                        mainPageProps.toggleSettingsDialog();
                    },
                },
            ],
        },
        {
            label: "&" + i18n.t("core:help"),
            submenu: [
                {
                    label: "&" + i18n.t("core:documentation"),
                    accelerator: mainPageProps.keyBindings.showHelp,
                    click: () => {
                        // mainPageProps.openURLExternally(AppConfig.documentationLinks.general);
                        mainPageProps.openHelpFeedbackPanel();
                    },
                },
                {
                    label: "&" + i18n.t("core:shortcutKeys"),
                    click: () => {
                        mainPageProps.toggleKeysDialog();
                    },
                },
                {
                    label: "Welcome Wizzard",
                    click: () => {
                        mainPageProps.toggleOnboardingDialog();
                    },
                },
                {
                    label: "&" + i18n.t("core:whatsNew"),
                    click: () => {
                        mainPageProps.openURLExternally(AppConfig.links.changelogURL);
                    },
                },
                {
                    type: "separator",
                },
                {
                    label: "&" + i18n.t("core:likeUsOnFacebook"),
                    click: () => {
                        mainPageProps.openURLExternally(AppConfig.links.facebook);
                    },
                },
                {
                    label: "&" + i18n.t("core:followOnTwitter"),
                    click: () => {
                        mainPageProps.openURLExternally(AppConfig.links.twitter);
                    },
                },
                {
                    type: "separator",
                },
                {
                    label: "&" + i18n.t("core:suggestNewFeatures"),
                    click: () => {
                        mainPageProps.openURLExternally(AppConfig.links.suggestFeature);
                    },
                },
                {
                    label: "&" + i18n.t("core:reportIssues"),
                    click: () => {
                        mainPageProps.openURLExternally(AppConfig.links.reportIssue);
                    },
                },
                {
                    type: "separator",
                },
                {
                    label: i18n.t("core:webClipperChrome"),
                    click: () => {
                        mainPageProps.openURLExternally(AppConfig.links.webClipperChrome);
                    },
                },
                {
                    label: i18n.t("core:webClipperFirefox"),
                    click: () => {
                        mainPageProps.openURLExternally(AppConfig.links.webClipperFirefox);
                    },
                },
                {
                    type: "separator",
                },
                {
                    label: "&" + i18n.t("core:license"),
                    click: () => {
                        mainPageProps.toggleLicenseDialog();
                    },
                },
                {
                    label: "&" + i18n.t("core:thirdPartyLibs"),
                    click: () => {
                        mainPageProps.toggleThirdPartyLibsDialog();
                    },
                },
                {
                    label: "&" + i18n.t("core:aboutPulseBrowser"),
                    click: () => {
                        mainPageProps.toggleAboutDialog();
                    },
                },
            ],
        },
    ];
    PlatformIO.initMainMenu(templateDefault);
}

// import { webFrame, ipcRenderer } from 'electron';
import PlatformIO from "./platform-io";
import i18n from "./i18n";
import AppConfig from "../config";

export default function buildTrayIconMenu(mainPageProps: any) {
    if (!AppConfig.isElectron) {
        return;
    }

    const cKey = AppConfig.isMacLike ? "  -  Cmd" : " - Ctrl";

    function openNextFile() {
        mainPageProps.openNextFile();
    }

    function openPrevFile() {
        mainPageProps.openPrevFile();
    }

    function playResumePlayback() {
        const audioEvent = new CustomEvent("toggle-resume", { detail: "" });
        window.dispatchEvent(audioEvent);
    }

    const trayMenuTemplate = [
        {
            label: i18n.t("core:showPulseBrowser") + cKey + "+Shift+W",
            click: PlatformIO.showMainWindow,
        },
        {
            label: i18n.t("core:showSearch") + cKey + "+Shift+F",
            click: mainPageProps.openSearchPanel,
        },
        {
            type: "separator",
        },
        {
            label: i18n.t("core:newFileNote") + cKey + "+Shift+N",
            click: mainPageProps.toggleCreateFileDialog,
        },
        {
            type: "separator",
        },
        {
            label: i18n.t("core:openNextFileTooltip") + cKey + "+Shift+D",
            click: openNextFile,
        },
        {
            label: i18n.t("core:openPrevFileTooltip") + cKey + "+Shift+A",
            click: openPrevFile,
        },
        {
            type: "separator",
        },
        {
            label: i18n.t("core:pauseResumePlayback") + cKey + "+Shift+P",
            click: playResumePlayback,
        },
        {
            type: "separator",
        },
        {
            label: i18n.t("core:quitPulseBrowser") + cKey + "+Q",
            click: PlatformIO.quitApp,
        },
    ];
    PlatformIO.initTrayMenu(trayMenuTemplate);
}

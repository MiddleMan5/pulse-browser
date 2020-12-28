
import AppConfig from "../config";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
    settingsVersion: number;
    isLoading: boolean;
    error: null;
    userId: null;
    loggedIn: boolean;
    isOnline: boolean;
    appDataPath: string;
    contentHash: string;
    isUpdateInProgress: boolean;
    isUpdateAvailable: boolean;
    tagDelimiter: string;
    maxSearchResult: number;
    desktopMode: boolean;
    newHTMLFileContent: string;
    showUnixHiddenEntries: boolean;
    checkForUpdates: boolean;
    coloredFileExtension: boolean;
    loadsLocationMetaData: boolean;
    searchInSubfolders: boolean;
    watchCurrentDirectory: boolean;
    firstRun: boolean;
    lastOpenedDirectory: string;
    showWarningRecursiveScan: boolean;
    calculateTags: boolean;
    loadLocationMeta: boolean;
    showMainMenu: boolean;
    lastOpenedLocation: string;
    useDefaultLocation: boolean;
    persistTagsInSidecarFile: boolean;
    addTagsToLibrary: boolean;
    interfaceLanguage: string;
    useTrashCan: boolean;
    useOCR: boolean;
    useTextExtraction: boolean;
    useGenerateThumbnails: boolean;
    tagTextColor: string;
    tagBackgroundColor: string;
    currentTheme: string;
    enableGlobalKeyboardShortcuts: boolean;
    zoomFactor: number;
    lastPublishedVersion: string;
    entryPropertiesSplitSize: number | string;
    leftVerticalSplitSize: number | string;
    mainVerticalSplitSize: number | string;
    supportedPerspectives: SupportedPerspective[];
    supportedThemes: string[];
    supportedLanguages: SupportedLanguage[];
    keyBindings: SupportedKeybinding[];
    supportedFileTypes: SupportedFileType[];
}

export interface SupportedFileType {
    type: string;
    viewer: string;
    color?: string;
    editor?: Editor;
}

export type Editor = "@pulsebrowser/html-editor" | "@pulsebrowser/json-editor" | "@pulsebrowser/text-editor";

export interface SupportedLanguage {
    iso: string;
    title: string;
}

export interface SupportedPerspective {
    id: string;
    name: string;
}

export interface SupportedKeybinding {
    name: string;
    command: string;
}

const defaultSettings: SettingsState = {
    settingsVersion: 3,
    isLoading: false,
    error: null,
    userId: null,
    loggedIn: false,
    isOnline: false,
    appDataPath: "",
    contentHash: "",
    isUpdateInProgress: false,
    isUpdateAvailable: false,
    tagDelimiter: " ",
    maxSearchResult: 1000,
    desktopMode: true,
    newHTMLFileContent:
        '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style type="text/css">body{overflow:auto;width:100%;height:100%;font:13.34px Ubuntu,arial,clean,sans-serif;color:#000;line-height:1.4em;background-color:#fff;padding:15px}p{margin:1em 0;line-height:1.5em}table{font:100%;margin:1em}table th{border-bottom:1px solid #bbb;padding:.2em 1em}table td{border-bottom:1px solid #ddd;padding:.2em 1em}input[type=image],input[type=password],input[type=text],textarea{font:99% helvetica,arial,freesans,sans-serif}option,select{padding:0 .25em}optgroup{margin-top:.5em}code,pre{font:12px Monaco, Courier ,monospace}pre{margin:1em 0;font-size:12px;background-color:#eee;border:1px solid #ddd;padding:5px;line-height:1.5em;color:#444;overflow:auto;-webkit-box-shadow:rgba(0,0,0,.07) 0 1px 2px inset;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px}pre code{padding:0;font-size:12px;background-color:#eee;border:none}code{font-size:12px;background-color:#f8f8ff;color:#444;padding:0 .2em;border:1px solid #dedede}img{border:0;max-width:100%}abbr{border-bottom:none}a{color:#4183c4;text-decoration:none}a:hover{text-decoration:underline}a code,a:link code,a:visited code{color:#4183c4}h2,h3{margin:1em 0}h1,h2,h3,h4,h5,h6{border:0}h1{font-size:170%;border-top:4px solid #aaa;padding-top:.5em;margin-top:1.5em}h1:first-child{margin-top:0;padding-top:.25em;border-top:none}h2{font-size:150%;margin-top:1.5em;border-top:4px solid #e0e0e0;padding-top:.5em}h3{font-size:130%;margin-top:1em}h4{font-size:120%;margin-top:1em}h5{font-size:115%;margin-top:1em}h6{font-size:110%;margin-top:1em}hr{border:1px solid #ddd}ol,ul{margin:1em 0 1em 2em}ol li,ul li{margin-top:.5em;margin-bottom:.5em}ol ol,ol ul,ul ol,ul ul{margin-top:0;margin-bottom:0}blockquote{margin:1em 0;border-left:5px solid #ddd;padding-left:.6em;color:#555}dt{font-weight:700;margin-left:1em}dd{margin-left:2em;margin-bottom:1em}</style></head><body></body></html>',
    showUnixHiddenEntries: false,
    checkForUpdates: true,
    coloredFileExtension: false,
    loadsLocationMetaData: false,
    searchInSubfolders: true,
    watchCurrentDirectory: false,
    firstRun: true,
    lastOpenedDirectory: "",
    showWarningRecursiveScan: true,
    calculateTags: false,
    loadLocationMeta: true,
    showMainMenu: false,
    lastOpenedLocation: "",
    useDefaultLocation: false, // TODO for remove
    persistTagsInSidecarFile: false, // old name writeMetaToSidecarFile -> persistTagsInSidecarFile
    addTagsToLibrary: true,
    interfaceLanguage: "en",
    useTrashCan: true,
    useOCR: false,
    useTextExtraction: false,
    useGenerateThumbnails: true,
    tagTextColor: "white",
    tagBackgroundColor: "#61DD61",
    currentTheme: "dark",
    enableGlobalKeyboardShortcuts: true,
    zoomFactor: 1,
    lastPublishedVersion: "",
    entryPropertiesSplitSize: 103,
    leftVerticalSplitSize: 350,
    mainVerticalSplitSize: "50%",
    supportedPerspectives: [
        {
            id: "perspectiveList",
            name: "List",
        },
    ],
    supportedThemes: ["light", "dark"],
    supportedLanguages: [
        {
            iso: "en",
            title: "English",
        },
    ],
    keyBindings: [
        {
            name: "selectAll",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+a",
        },
        {
            name: "closeViewer",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+w",
        },
        {
            name: "saveDocument",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+s",
        },
        {
            name: "reloadDocument",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+r",
        },
        {
            name: "editDocument",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+e",
        },
        {
            name: "deleteDocument",
            command: "del",
        },
        {
            name: "showLocationManager",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+1",
        },
        {
            name: "showTagLibrary",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+2",
        },
        {
            name: "showSearch",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+3",
        },
        {
            name: "toggleShowHiddenEntries",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+h",
        },
        {
            name: "addRemoveTags",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+t",
        },
        {
            name: "nextDocument",
            command: "down",
        },
        {
            name: "prevDocument",
            command: "up",
        },
        {
            name: "showHelp",
            command: "f1",
        },
        {
            name: "reloadApplication",
            command: "r a",
        },
        {
            name: "toggleFullScreen",
            command: "f11",
        },
        {
            name: "openDevTools",
            command: "f10",
        },
        {
            name: "openSearch",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+f",
        },
        {
            name: "renameFile",
            command: "f2",
        },
        {
            name: "openEntry",
            command: "enter",
        },
        {
            name: "openParentDirectory",
            command: "backspace",
        },
        {
            name: "openFileExternally",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+enter",
        },
        {
            name: "zoomIn",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "+",
        },
        {
            name: "zoomOut",
            command: (AppConfig.isMacLike ? "command" : "ctrl") + "-",
        },
    ],
    supportedFileTypes: [
        {
            type: "bmp",
            viewer: "@pulsebrowser/image-viewer",
            color: "#9fd5ba",
        },
        {
            type: "c",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "clj",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "coffee",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "cpp",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "cs",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "css",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "desktop",
            viewer: "@pulsebrowser/url-viewer",
            color: "",
        },
        {
            type: "eml",
            viewer: "@pulsebrowser/mhtml-viewer",
            color: "",
        },
        // {
        //   type: 'epub',
        //   viewer: '@pulsebrowser/ebook-viewer',
        //   color: ''
        // },
        {
            type: "flac",
            viewer: "@pulsebrowser/media-player",
            color: "",
        },
        {
            type: "acc",
            viewer: "@pulsebrowser/media-player",
            color: "",
        },
        {
            type: "gif",
            viewer: "@pulsebrowser/image-viewer",
            color: "#9fd5ba",
        },
        {
            type: "groovy",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "h",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "haxe",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "htm",
            viewer: "@pulsebrowser/html-viewer",
            editor: "@pulsebrowser/html-editor",
            color: "#beefed",
        },
        {
            type: "html",
            viewer: "@pulsebrowser/html-viewer",
            editor: "@pulsebrowser/html-editor",
            color: "",
        },
        {
            type: "ico",
            viewer: "@pulsebrowser/image-viewer",
            color: "#9fd5ba",
        },
        {
            type: "java",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "jpeg",
            viewer: "@pulsebrowser/image-viewer",
            color: "#9fd5ba",
        },
        {
            type: "jpg",
            viewer: "@pulsebrowser/image-viewer",
            color: "#9fd5ba",
        },
        {
            type: "js",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "#d7ff78",
        },
        {
            type: "jsm",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "json",
            viewer: "@pulsebrowser/json-editor",
            editor: "@pulsebrowser/json-editor",
            color: "",
        },
        {
            type: "less",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "lua",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "mkv",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "md",
            viewer: "@pulsebrowser/md-viewer",
            editor: "@pulsebrowser/text-editor",
            color: "#beefed",
        },
        {
            type: "mdown",
            viewer: "@pulsebrowser/md-viewer",
            editor: "@pulsebrowser/text-editor",
            color: "#beefed",
        },
        {
            type: "oga",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "ogg",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "ogv",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "ogx",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "opus",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "pdf",
            viewer: "@pulsebrowser/pdf-viewer",
            color: "#f5897f",
        },
        {
            type: "php",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "pl",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "png",
            viewer: "@pulsebrowser/image-viewer",
            color: "#9fd5ba",
        },
        {
            type: "psd",
            viewer: "@pulsebrowser/image-viewer",
        },
        {
            type: "py",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "rb",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "rtf",
            viewer: "@pulsebrowser/rtf-viewer",
            color: "",
        },
        {
            type: "sh",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "spx",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "sql",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "svg",
            viewer: "@pulsebrowser/image-viewer",
            editor: "@pulsebrowser/text-editor",
            color: "#9fd5ba",
        },
        {
            type: "tif",
            viewer: "@pulsebrowser/image-viewer",
        },
        {
            type: "tiff",
            viewer: "@pulsebrowser/image-viewer",
        },
        {
            type: "txt",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
        },
        {
            type: "url",
            viewer: "@pulsebrowser/url-viewer",
            color: "",
        },
        {
            type: "wav",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "wave",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "webm",
            viewer: "@pulsebrowser/media-player",
            color: "#c5e4f9",
        },
        {
            type: "webp",
            viewer: "@pulsebrowser/image-viewer",
            color: "#9fd5ba",
        },
        {
            type: "website",
            viewer: "@pulsebrowser/url-viewer",
            color: "",
        },
        {
            type: "xhtml",
            viewer: "@pulsebrowser/html-viewer",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "xml",
            viewer: "@pulsebrowser/text-editor",
            editor: "@pulsebrowser/text-editor",
            color: "",
        },
        {
            type: "zip",
            viewer: "@pulsebrowser/archive-viewer",
            color: "#ffe766",
        },
        {
            type: "docx",
            viewer: "@pulsebrowser/document-viewer",
            color: "#2196f3",
        },
    ],
};

const settingsSlice = createSlice({
    name: "settings",
    initialState: defaultSettings,
    reducers: {
        toggleTagGroup(state: SettingsState, action: PayloadAction<string>) {
            throw Error("Not implemented");
        },
        setTagDelimiter(state: SettingsState, action: PayloadAction<string>) {
            state.tagDelimiter = action.payload;
        },
        setMaxSearchResult(state: SettingsState, action: PayloadAction<number>) {
            state.maxSearchResult = action.payload;
        },
        setDesktopMode(state: SettingsState, action: PayloadAction<boolean>) {
            state.desktopMode = action.payload;
        },
        toggleShowUnixHiddenEntries(state: SettingsState) {
            state.showUnixHiddenEntries = !state.showUnixHiddenEntries;
        },
        setCheckForUpdates(state: SettingsState, action: PayloadAction<boolean>) {
            state.checkForUpdates = action.payload;
        },
        setLanguage(state: SettingsState, action: PayloadAction<string>) {
            state.interfaceLanguage = action.payload;
        },
        setUseDefaultLocation(state: SettingsState, action: PayloadAction<boolean>) {
            state.useDefaultLocation = action.payload;
        },
        setColoredFileExtension(state: SettingsState, action: PayloadAction<boolean>) {
            state.coloredFileExtension = action.payload;
        },
        setShowTagAreaOnStartup(state: SettingsState, action: PayloadAction<boolean>) {
            throw Error("Not implemented");
        },
        setLoadsLocationMetaData(state: SettingsState, action: PayloadAction<boolean>) {
            state.loadsLocationMetaData = action.payload;
        },
        setSearchInSubfolders(state: SettingsState, action: PayloadAction<boolean>) {
            state.searchInSubfolders = action.payload;
        },
        setWatchCurrentDirectory(state: SettingsState, action: PayloadAction<boolean>) {
            state.watchCurrentDirectory = action.payload;
        },
        setCalculateTags(state: SettingsState, action: PayloadAction<boolean>) {
            state.calculateTags = action.payload;
        },
        setUseTrashCan(state: SettingsState, action: PayloadAction<boolean>) {
            state.useTrashCan = action.payload;
        },
        setPersistTagsInSidecarFile(state: SettingsState, action: PayloadAction<boolean>) {
            state.persistTagsInSidecarFile = action.payload;
        },
        setAddTagsToLibrary(state: SettingsState, action: PayloadAction<boolean>) {
            state.addTagsToLibrary = action.payload;
        },
        setUseGenerateThumbnails(state: SettingsState, action: PayloadAction<boolean>) {
            state.useGenerateThumbnails = action.payload;
        },
        setUseTextExtraction(state: SettingsState, action: PayloadAction<boolean>) {
            state.useTextExtraction = action.payload;
        },
        setAppDataPath(state: SettingsState, action: PayloadAction<string>) {
            state.appDataPath = action.payload;
        },
        setContentHash(state: SettingsState, action: PayloadAction<string>) {
            state.contentHash = action.payload;
        },
        setTagBackgroundColor(state: SettingsState, action: PayloadAction<string>) {
            state.tagBackgroundColor = action.payload;
        },
        setTagTextColor(state: SettingsState, action: PayloadAction<string>) {
            state.tagTextColor = action.payload;
        },
        setCurrentTheme(state: SettingsState, action: PayloadAction<string>) {
            state.currentTheme = action.payload;
        },
        setSupportedFileTypes(state: SettingsState, action: PayloadAction<SupportedFileType[]>) {
            state.supportedFileTypes = action.payload;
        },
        setEntryPropertiesSplitSize(state: SettingsState, action: PayloadAction<number | string>) {
            state.entryPropertiesSplitSize = action.payload;
        },
        setMainVerticalSplitSize(state: SettingsState, action: PayloadAction<number | string>) {
            state.mainVerticalSplitSize = action.payload;
        },
        setLeftVerticalSplitSize(state: SettingsState, action: PayloadAction<number | string>) {
            state.leftVerticalSplitSize = action.payload;
        },
        setFirstRun(state: SettingsState, action: PayloadAction<boolean>) {
            state.firstRun = action.payload;
        },
        upgradeSettings(state: SettingsState) {
            throw Error("Not implemented");
        },
        setLastPublishedVersion(state: SettingsState, action: PayloadAction<string>) {
            // TODO: Coerce to semver
            state.lastPublishedVersion = action.payload;
        }
    },
});

export const actions = settingsSlice.actions
export default settingsSlice.reducer;

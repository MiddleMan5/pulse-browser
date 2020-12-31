const isCordovaiOS =
    /^file:\/{3}[^\/]/i.test(window.location.href) && /ios|iphone|ipod|ipad/i.test(navigator.userAgent);
const isCordovaAndroid = document.URL.indexOf("file:///android_asset") === 0;
const iOSMatcher = navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
const isIOS = iOSMatcher && iOSMatcher.length > 0;
const isAndroid = navigator.userAgent.toLowerCase().includes("android");

export const AppConfig = {
    metaFolder: ".ts",
    metaFolderFile: "tsm.json",
    folderIndexFile: "tsi.json",
    folderThumbFile: "tst.jpg",
    metaFileExt: ".json",
    thumbFileExt: ".jpg",
    thumbType: "image/jpeg",
    contentFileExt: ".txt",
    beginTagContainer: "[",
    endTagContainer: "]",
    tagDelimiter: " ",
    prefixTagContainer: "",
    maxCollectedTag: 500,
    maxThumbSize: 400,
    thumbBgColor: "#FFFFFF",
    indexerLimit: 200000,
    maxIndexAge: 10 * 60 * 1000, // 10 minutes
    // maxSearchResult: 1000,
    defaultFileColor: "#808080",
    defaultFolderColor: "#582727", // 555 transparent #FDEEBD #ff791b #2c001e #880e4f
    isElectron: navigator.userAgent.toLowerCase().indexOf(" electron/") > -1,
    isFirefox: navigator.userAgent.toLowerCase().includes("firefox"), // typeof InstallTrigger !== 'undefined';
    isWin: navigator.appVersion.includes("Win"),
    isMacLike: navigator.userAgent.match(/(Mac|iPhone|iPod|iPad)/i),
    isIOS,
    isAndroid,
    isWeb: document.URL.startsWith("http") && !document.URL.startsWith("http://localhost:1212/"),
    isCordovaiOS,
    isCordovaAndroid,
    isCordova: isCordovaiOS || isCordovaAndroid,
    isMobile: isCordovaiOS || isCordovaAndroid || isIOS || isAndroid,
    customLogo: window.ExtLogoURL || false,
    showAdvancedSearch: window.ExtShowAdvancedSearch !== undefined ? window.ExtShowAdvancedSearch : true,
    showSmartTags: window.ExtShowSmartTags !== undefined ? window.ExtShowSmartTags : true,
    showWelcomePanel: window.ExtShowWelcomePanel !== undefined ? window.ExtShowWelcomePanel : true,
    locationsReadOnly: window.ExtLocations !== undefined,
    sidebarColor: window.ExtSidebarColor || "#2C001E", // '#00D1A1' // #008023
    sidebarSelectionColor: window.ExtSidebarSelectionColor || "#880E4F",
    lightThemeLightColor: window.ExtLightThemeLightColor || "#dcf3ec",
    lightThemeMainColor: window.ExtLightThemeMainColor || "#1dd19f",
    darkThemeLightColor: window.ExtDarkThemeLightColor || "#56454e",
    darkThemeMainColor: window.ExtDarkThemeMainColor || "#ff9abe",
    dirSeparator: navigator.appVersion.includes("Win") && !document.URL.startsWith("http") ? "\\" : "/",
};

export default AppConfig;

import React, { useState, useContext } from "react";
import { Theme, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// FIXME: Themes don't seem to be applying properly

// TODO: Bundle themes from json files in directory? (webpack)
import DarkTheme from "./dark.theme";
import LightTheme from "./light.theme";

// TODO: Get babel or webpack to generate this map
const ThemeList: { [name: string]: Theme } = {
    DarkTheme,
    LightTheme,
};

// Typescript sugar
const ThemeNames = Object.keys(ThemeList);
type ThemeName = typeof ThemeNames[number];

interface PulseThemeProviderProps {
    // The initial themeName to apply
    themeName?: ThemeName;
}

export const PulseThemeProvider = (props: React.PropsWithChildren<PulseThemeProviderProps>) => {
    const { children } = props;

    // Check to see if color scheme requested from browser
    // TODO: Check this dynamically
    const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");
    const defaultThemeName = prefersLightMode ? "LightTheme" : "DarkTheme";

    // State to hold the selected theme name
    const [themeName, setThemeName] = useState(props?.themeName ?? defaultThemeName);

    // Theme provider context
    const context = React.createContext({ themeName, setThemeName });

    // Retrieve the active theme type
    // TODO: useEffect?? Get dynamically
    const theme = () => ThemeList[themeName];

    return (
        <context.Provider value={useContext(context)}>
            <ThemeProvider theme={theme()}>{children}</ThemeProvider>
        </context.Provider>
    );
};

import React, { useState, useContext, useEffect } from "react";
import { Theme, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// FIXME: Themes don't seem to be applying properly

// TODO: Bundle themes from json files in directory? (webpack)
import DarkTheme from "./dark.theme";
import LightTheme from "./light.theme";

// TODO: Get babel or webpack to generate this map
const ThemeList: { [name: string]: Theme } = {
    dark: DarkTheme,
    light: LightTheme,
};

// Typescript sugar
const ThemeNames = Object.keys(ThemeList);
type ThemeName = typeof ThemeNames[number];

interface PulseThemeProviderProps {
    // The initial themeName to apply
    themeName: ThemeName;
}

export const PulseThemeProvider = (props: React.PropsWithChildren<PulseThemeProviderProps>) => {
    const { children } = props;

    // Check to see if color scheme requested from browser
    // TODO: Use this in index/onboarding??
    const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");

    // State to hold the selected theme name
    const [themeName, setThemeName] = useState(props?.themeName);

    // Theme provider context
    const context = React.createContext({ themeName, setThemeName });

    // FIXME: I'm pretty sure none of this is necessary
    useEffect(() => {
        setThemeName(props.themeName);
    }, [props.themeName]);

    return (
        <context.Provider value={useContext(context)}>
            <ThemeProvider theme={ThemeList[themeName]}>{children}</ThemeProvider>
        </context.Provider>
    );
};

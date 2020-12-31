import React from "react";
import { Theme, ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers";

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
export const ThemeNames = Object.keys(ThemeList);
export type ThemeName = typeof ThemeNames[number];

export const StoreThemeProvider: React.FC = ({ children }) => {
    const { theme } = useSelector((state: RootState) => state.settings);

    return <MuiThemeProvider theme={ThemeList[theme]}>{children}</MuiThemeProvider>;
};

export default ThemeList;

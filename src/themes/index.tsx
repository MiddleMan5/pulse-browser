import React from "react";
import { Theme, ThemeProvider as MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducers";

const ThemeMap: { [name: string]: Theme } = {};

// TODO: Bundle themes from json files in directory?
// TODO: Generate dynamically
export const ThemeNames = ["dark-blue", "dark", "hacker", "light", "red-rover"];
// Typescript sugar
export type ThemeName = typeof ThemeNames[number];

// Load exported themeOptions from every listed theme file
export const ThemeList = ThemeNames.map((name) => {
    return { [name]: createMuiTheme(require(`./${name}.theme`).themeOptions) };
});
Object.assign(ThemeMap, ...ThemeList);

// Load theme from redux store
export const ThemeProvider: React.FC = ({ children }) => {
    const { theme } = useSelector((state: RootState) => state.settings);

    return <MuiThemeProvider theme={ThemeMap[theme]}>{children}</MuiThemeProvider>;
};

export default ThemeList;

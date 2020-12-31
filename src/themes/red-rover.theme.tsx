import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

export const themeOptions: ThemeOptions = {
    palette: {
        type: "dark",
        primary: {
            main: "#ff8f00",
        },
        secondary: {
            main: "#f50057",
        },
        background: {
            default: "#310000",
            paper: "#731010",
        },
    },
    typography: {
        fontFamily: "Do Hyeon",
    },
    shape: {
        borderRadius: 16,
    },
};

export default themeOptions;

import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Dark theme
const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: "rgb(cc, cc, 55)",
            light: "rgb(81, 91, 95)",
            dark: "rgb(26, 35, 39)",
            contrastText: "rgb(255, 255, 255)",
        },
        secondary: {
            main: "#FFB74D",
            light: "rgb(255, 197, 112)",
            dark: "rgb(200, 147, 89)",
            contrastText: "rgba(0, 0, 0, 0.87)",
        },
        error: {
            main: red.A400,
        },
    },
    overrides: {
        MuiTab: {
            wrapper: {
                alignItems: "flex-end",
                justifyContent: "center",
                flexDirection: "row-reverse",
            },
        },
    },
});

export default theme;

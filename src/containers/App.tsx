import { CssBaseline } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { PulseThemeProvider } from "../components";
import { RootState } from "../reducers";
import { HomePage } from "./HomePage";

const App: React.FC = () => {
    const { currentTheme } = useSelector((state: RootState) => state.settings);

    return (
        <PulseThemeProvider themeName={currentTheme}>
            <CssBaseline />
            <HomePage />
        </PulseThemeProvider>
    );
};

export default App;

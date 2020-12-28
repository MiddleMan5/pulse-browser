import { CssBaseline } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { PulseThemeProvider } from "../components";
import { getCurrentTheme } from "../reducers/settings";
import { HomePage } from "./HomePage";

interface AppProps {
    currentTheme: string;
}

function App({ currentTheme }: AppProps) {
    return (
        <PulseThemeProvider themeName={currentTheme}>
            <CssBaseline />
            <HomePage />
        </PulseThemeProvider>
    );
}

function mapStateToProps(state: any) {
    return {
        currentTheme: state.settings.currentTheme,
    };
}

export default connect(mapStateToProps)(App);

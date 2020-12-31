import { CssBaseline } from "@material-ui/core";
import React from "react";
import { render } from "react-dom";
import App from "./containers/App";
import { DatabaseStoreProvider } from "./components/DatabaseStoreProvider";
import { StoreThemeProvider } from "./components";

export const Root: React.FC = () => {
    return (
        <DatabaseStoreProvider>
            <StoreThemeProvider>
                <CssBaseline />
                <App />
            </StoreThemeProvider>
        </DatabaseStoreProvider>
    );
};

render(<Root />, document.getElementById("root"));

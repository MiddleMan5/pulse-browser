import { CssBaseline } from "@material-ui/core";
import React from "react";
import { render } from "react-dom";
import App from "./containers/App";
import { PersistentStoreProvider } from "./components/PersistentStoreProvider";
import { ThemeProvider } from "./themes";
import { PulseDatabase } from "./store/database";
import { Provider as DatabaseProvider } from "use-pouchdb";

const pulseDb = new PulseDatabase();

export const Root: React.FC = () => {
    return (
        <DatabaseProvider
            default="local"
            databases={{
                local: pulseDb.db,
            }}
        >
            <PersistentStoreProvider>
                <ThemeProvider>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </PersistentStoreProvider>
        </DatabaseProvider>
    );
};

render(<Root />, document.getElementById("root"));

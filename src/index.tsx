import { CssBaseline } from "@material-ui/core";
import React from "react";
import { render } from "react-dom";
import { Provider as StoreProvider } from "react-redux";
import App from "./containers/App";
import store from "./store";

export const Root: React.FC = () => {
    return (
        <StoreProvider store={store}>
            <CssBaseline />
            <App />
        </StoreProvider>
    );
};

render(<Root />, document.getElementById("root"));

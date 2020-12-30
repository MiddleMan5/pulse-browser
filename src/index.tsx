import React from "react";
import { render } from "react-dom";
import { Provider as StoreProvider } from "react-redux";
import App from "./containers/App";
import store from "./store";

render(
    <StoreProvider store={store}>
        <App />
    </StoreProvider>,
    document.getElementById("root")
);

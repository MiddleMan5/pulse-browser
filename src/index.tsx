import React from "react";
import { render } from "react-dom";

import App from "./containers/App";
import configureStore from "./store/configureStore";

const { store, persistor } = configureStore({});
render(<App store={store} persistor={persistor} />, document.getElementById("root"));

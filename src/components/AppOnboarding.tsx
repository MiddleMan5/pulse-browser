import React, { Component } from "react";
import Joyride from "react-joyride";
import i18n from "../services/i18n";

class AppOnboarding extends Component {
    state = {
        run: false,
    };

    /* componentDidMount() {
    setTimeout(() => {
      this.setState({
        run: true
      });
    }, 1000);
  } */

    callback = (data) => {
        // const { action, index, type } = data;
    };

    render() {
        const { run } = this.state;
        const steps = [
            {
                target: "[data-tid=createNewLocation]",
                content: i18n.t("welcomeContent"),
                placement: "bottom",
            },
            {
                target: "[data-tid=aboutPulseBrowser]",
                content: "Hello world",
                placement: "bottom",
            },
        ];
        return <Joyride steps={steps} run={run} callback={this.callback} />;
    }
}

export default AppOnboarding;

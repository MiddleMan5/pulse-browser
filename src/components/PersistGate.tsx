import React, { PureComponent } from "react";

type Props = {
    onBeforeLift?: Function;
    children: React.ReactNode | Function;
    loading: React.ReactNode;
    persistor: any;
};

type State = {
    bootstrapped: boolean;
};


// FIXME: Actually implement
export class PersistGate extends PureComponent<Props, State> {
    render() {
        if (typeof this.props?.children === "function") {
            const funkyChildren = this.props.children as Function;
            return funkyChildren(this.state.bootstrapped);
        } else {
            return this.props.children;
        }
    }
}

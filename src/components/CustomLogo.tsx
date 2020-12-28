import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
const Pro = undefined;
import TextLogoIcon from "../assets/images/text-logo.svg";
import WebLogoIcon from "../assets/images/text-logo-web.svg";
import { actions as AppActions } from "../reducers/app";
import { version } from "../../package.json";
import AppConfig from "../config";

const AppVersionBadge = withStyles((theme) => ({
    badge: {
        top: "25%",
        right: -15,
        color: theme.palette.type === "light" ? theme.palette.grey[900] : theme.palette.grey[200],
        backgroundColor: theme.palette.type === "light" ? theme.palette.grey[200] : theme.palette.grey[900],
    },
}))(Badge);

interface Props {
    toggleAboutDialog: () => void;
}

let logo = Pro ? Pro.TextLogoIcon : TextLogoIcon;
if (AppConfig.isWeb) {
    logo = WebLogoIcon;
}
if (AppConfig.customLogo) {
    logo = AppConfig.customLogo;
}

const CustomLogo = (props: Props) => (
    <AppVersionBadge title="App Version" badgeContent={"v" + version} color="primary">
        <IconButton
            style={{ height: 50, padding: 0, marginBottom: 15 }}
            data-tid="aboutPulseBrowser"
            onClick={props.toggleAboutDialog}
        >
            <img style={{ maxHeight: 50, maxWidth: 200 }} src={logo} alt="PulseBrowser" />
        </IconButton>
    </AppVersionBadge>
);

function mapActionCreatorsToProps(dispatch) {
    return bindActionCreators(
        {
            toggleAboutDialog: AppActions.toggleAboutDialog,
        },
        dispatch
    );
}

export default connect(undefined, mapActionCreatorsToProps)(CustomLogo);

import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Dialog from "@material-ui/core/Dialog";
import semver from "semver";
import LogoIcon from "../assets/images/icon100x100.svg";
import i18n from "../../services/i18n";
import { name, version } from "../../../package.json";
const Pro = undefined;
import { getLastVersion } from "../../reducers/settings";
// import AppConfig from "../../config";

interface Props {
    open: boolean;
    fullScreen: boolean;
    openURLExternally: (url: string) => void;
    toggleLicenseDialog: () => void;
    toggleThirdPartyLibsDialog: () => void;
    onClose: () => void;
}

const versionMeta = { version, name, commitId: "12345678", buildTime: Date.now() };
let buildID = versionMeta.commitId;
if (buildID && buildID.length >= 11) {
    buildID = buildID.slice(0, 11);
}

const productName = versionMeta.name + (Pro ? " Pro" : "");
document.title = productName + " " + versionMeta.version;

const AboutDialog = (props: Props) => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [newVersion, setNewVersion] = useState("");
    const { open, onClose, fullScreen } = props;

    let versionInfo = "Check for updates";
    if (newVersion && newVersion.length > 1) {
        if (updateAvailable) {
            versionInfo = i18n.t("getNewVersion", { newVersion });
        } else {
            versionInfo = i18n.t("latestVersion", { productName });
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullScreen={fullScreen} keepMounted scroll="paper">
            <DialogTitle>{productName}</DialogTitle>
            <DialogContent>
                <img
                    alt="PulseBrowser logo"
                    src={LogoIcon}
                    style={{ float: "left", marginRight: 10, width: 120, height: 120 }}
                />
                <Typography
                    variant="subtitle1"
                    title={"Build on: " + versionMeta.buildTime + "\nPlatform: " + navigator.appVersion}
                >
                    Version:&nbsp;
                    {versionMeta.version}
                    &nbsp;BuildID:&nbsp;
                    {buildID}
                </Typography>
                <br />
                <Typography id="aboutContent" variant="body1">
                    <strong>
                        {productName}
                        &nbsp;
                    </strong>
                    is made possible by the IMADIRTYPIRATE(github.com/IMADIRTYPIRATE) open source project and other
                    <Button
                        size="small"
                        color="primary"
                        style={{ marginLeft: 10 }}
                        onClick={props.toggleThirdPartyLibsDialog}
                    >
                        open source software
                    </Button>
                    .
                    <br />
                    {!Pro && (
                        <span>
                            This program is free software: you can redistribute it and/or modify it under the terms of
                            the GNU Affero General Public License (version 3) as published by the Free Software
                            Foundation.
                        </span>
                    )}
                    <br />
                    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
                    even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the License
                    for more details.
                    <br />
                    <br />
                    <Button
                        size="small"
                        color="primary"
                        data-tid="openLicenseDialog"
                        onClick={props.toggleLicenseDialog}
                    >
                        License Agreement
                    </Button>
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    data-tid="checkForUpdates"
                    title={i18n.t("core:checkForNewVersion")}
                    onClick={() => {}}
                    color="primary"
                >
                    {versionInfo}
                </Button>
                <Button data-tid="closeAboutDialog" onClick={onClose} color="primary">
                    {i18n.t("core:ok")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withMobileDialog()(AboutDialog);

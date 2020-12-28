import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import HelpIcon from "@material-ui/icons/Help";
import i18n from "../services/i18n";
import AppConfig from "../config";

interface Props {
    classes?: any;
    open: boolean;
    anchorEl: Element;
    onClose: () => void;
    openURLExternally: (url: string) => void;
}

const LocationManagerMenu = (props: Props) => (
    <div style={{ overflowY: "hidden" }}>
        <Menu anchorEl={props.anchorEl} open={props.open} onClose={props.onClose}>
            <MenuItem
                data-tid="locationManagerHelp"
                onClick={() => {
                    props.onClose();
                    props.openURLExternally(AppConfig.documentationLinks.locations);
                }}
            >
                <ListItemIcon>
                    <HelpIcon />
                </ListItemIcon>
                <ListItemText primary={i18n.t("core:help")} />
            </MenuItem>
        </Menu>
    </div>
);

export default LocationManagerMenu;

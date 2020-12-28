import React from "react";
import { connect } from "react-redux";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import i18n from "../services/i18n";
import AppConfig from "../config";
import { getKeyBindingObject } from "../reducers/settings";

const styles = (theme) => ({
    root: {
        minWidth: 350,
    },
    shortcutKey: {
        backgroundColor: "#D6D6D6",
        font: "Console",
        fontFamily: "monospace",
        padding: "5px",
        borderRadius: "5px",
    },
});

interface Props {
    open: boolean;
    classes: any;
    fullScreen: boolean;
    keyBindings: Array<any>;
    onClose: () => void;
}

const KeyboardDialog = (props: Props) => {
    const { open, onClose, fullScreen } = props;
    return (
        <Dialog open={open} onClose={onClose} fullScreen={fullScreen} keepMounted scroll="paper">
            <DialogTitle>{i18n.t("core:shortcutKeys")}</DialogTitle>
            <DialogContent
                className={props.classes.root}
                data-tid="keyboardShortCutsDialog"
                style={{ overflow: AppConfig.isFirefox ? "auto" : "overlay" }}
            >
                <List dense={false}>
                    {props.keyBindings &&
                        Object.keys(props.keyBindings).map((shortcutKey) => (
                            <ListItem key={shortcutKey}>
                                <ListItemText primary={i18n.t("core:" + shortcutKey)} />
                                <ListItemSecondaryAction className={props.classes.shortcutKey}>
                                    {props.keyBindings[shortcutKey]}
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button data-tid="closeKeyboardDialog" onClick={props.onClose} color="primary">
                    {i18n.t("core:ok")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

function mapStateToProps(state) {
    return {
        keyBindings: getKeyBindingObject(state),
    };
}

export default connect(mapStateToProps)(withMobileDialog()(withStyles(styles)(KeyboardDialog)));

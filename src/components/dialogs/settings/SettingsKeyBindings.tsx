import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PlatformIO from "../../../services/platform-io";
import i18n from "../../../services/i18n";
import { actions as SettingsActions, getKeyBindings, isGlobalKeyBindingEnabled } from "../../../reducers/settings";
import { isStr } from "../../../utils/misc";

const styles: any = (theme: any) => ({
    root: {
        background: theme.palette.background.paper,
    },
    keyBinding: {
        marginTop: 10,
        marginBottom: 10,
    },
    listItem: {
        paddingLeft: 0,
        paddingRight: 0,
    },
});

interface Props {
    classes: any;
    keyBindings: Array<any>;
    setKeyBinding: (kbName: string, kbCommand: string) => void;
    setGlobalKeyBinding: (value: boolean) => void;
    globalKeyBindingEnabled: boolean;
}

const SettingsKeyBindings = (props: Props) => {
    const { keyBindings, classes, setKeyBinding, setGlobalKeyBinding, globalKeyBindingEnabled } = props;
    return (
        <form className={classes.root} noValidate autoComplete="off">
            <ListItem className={classes.listItem}>
                <ListItemText primary={i18n.t("core:enableGlobalKeyboardShortcuts")} />
                <Switch
                    onClick={() => {
                        setGlobalKeyBinding(!globalKeyBindingEnabled);
                        PlatformIO.setGlobalShortcuts(!globalKeyBindingEnabled);
                    }}
                    checked={globalKeyBindingEnabled}
                />
            </ListItem>
            {keyBindings.map((keyBinding) => {
                const defaultBinding = {
                    name: "FIXME",
                    command: "DefaultSettings.keyBindings.filter((kb) => kb.name === keyBinding.name)[0]",
                };
                return (
                    <TextField
                        className={classes.keyBinding}
                        key={keyBinding.name}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        onBlur={(event) => setKeyBinding(keyBinding.name, event.target.value)}
                        label={i18n.t("core:" + keyBinding.name)}
                        placeholder={"suggested binding: " + (defaultBinding ? defaultBinding.command : "")}
                        defaultValue={isStr(keyBinding.command) ? keyBinding.command : ""}
                    />
                );
            })}
        </form>
    );
};

function mapStateToProps(state) {
    return {
        keyBindings: getKeyBindings(state),
        globalKeyBindingEnabled: isGlobalKeyBindingEnabled(state),
    };
}

function mapActionCreatorsToProps(dispatch) {
    return bindActionCreators(SettingsActions, dispatch);
}

export default connect(mapStateToProps, mapActionCreatorsToProps)(withStyles(styles)(SettingsKeyBindings));

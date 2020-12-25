import {
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
    Switch,
    TextField,
    Tooltip,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        flexDirection: "row",
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    setting: {
        width: "100%",
    },
}));

export interface SettingProps {
    key: string;
    label: string;
    value: string | number | boolean;
    description?: string;
}

export function Setting(props: React.PropsWithChildren<SettingProps>) {
    const classes = useStyles();

    const inputElement = (function () {
        switch (typeof props.value) {
            case "number":
            case "string":
                return (
                    <TextField
                        value={props.value}
                        inputProps={{ "aria-labelledby": `switch-list-label-${props.key}` }}
                    />
                );
            case "boolean":
                return (
                    <Switch
                        edge="end"
                        checked={props.value as boolean}
                        inputProps={{ "aria-labelledby": `switch-list-label-${props.key}` }}
                    />
                );
            default:
                return undefined;
        }
    })();

    return (
        <ListItem className={classes.setting}>
            <Tooltip title={props.description ?? props.key} aria-label={props.key}>
                <ListItemText id={`switch-list-label-${props.key}`} primary={props.label} />
            </Tooltip>
            <ListItemSecondaryAction>{inputElement}</ListItemSecondaryAction>
        </ListItem>
    );
}

export interface SettingsPanelProps {}

export default function SettingsPanel(props: React.PropsWithChildren<SettingsPanelProps> | any) {
    const classes = useStyles();

    return (
        <List subheader={<ListSubheader>Settings</ListSubheader>} className={classes.root}>
            <Setting key="test1" label="Test Option 1" value={true} description="This is a test option" />
            <Setting key="test2" label="Test Option 2" value={false} description="This is a test option" />
            <Setting key="test3" label="Test Option 3" value={true} description="This is a test option" />
            <Setting key="test4" label="Test Option 4" value="Hello" description="This is a test option" />
            <Setting key="test5" label="Test Option 5" value={1} description="This is a test option" />
        </List>
    );
}

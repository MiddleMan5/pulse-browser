import {
    Box,
    List,
    ListSubheader,
    ListItem,
    Switch,
    Select,
    ListItemSecondaryAction,
    ListItemText,
    InputLabel,
    Container,
    Input,
    MenuItem,
    Button,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rootActions, RootState } from "../../store/reducers";
import ColorPickerDialog from "../../components/ColorPickerDialog";
import { ThemeNames, ThemeName } from "../../components/ThemeProvider";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexGrow: 1,
            flexDirection: "row",
            width: "100%",
            backgroundColor: theme.palette.background.paper,
        },
        listItem: {
            width: "100%",
        },
        colorDialogButton: {},
    })
);

export default function SettingsPage() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { setTheme, setTagColor } = rootActions.settings;
    const { theme, language, tagColor } = useSelector((state: RootState) => state.settings);
    const [colorDialogOpen, setColorDialogOpen] = useState(false);

    return (
        <Box className={classes.root}>
            <List>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Theme" />
                    <Select
                        data-tid="settingsSetCurrentTheme"
                        value={theme}
                        onChange={(event) => dispatch(setTheme(event.target.value as string))}
                        input={<Input id="themeSelector" />}
                    >
                        {ThemeNames.map((name) => (
                            <MenuItem key={name} value={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </ListItem>

                <ListItem className={classes.listItem}>
                    <ListItemText primary="Tag Color" />
                    <Button
                        data-tid="settingsToggleDefaultTagBackgroundColor"
                        className={classes.colorDialogButton}
                        size="small"
                        style={{
                            backgroundColor: tagColor,
                        }}
                        onClick={() => setColorDialogOpen(!colorDialogOpen)}
                    >
                        &nbsp;
                    </Button>
                    <ColorPickerDialog
                        open={colorDialogOpen}
                        setColor={(color: string) => dispatch(setTagColor(color))}
                        onClose={() => setColorDialogOpen(!colorDialogOpen)}
                        color={tagColor}
                    />
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Language" />
                    <Select
                        data-tid="settingsSetLanguage"
                        value={language.title}
                        //onChange={(event: any) => this.props.setLanguage(event.target.value)}
                        input={<Input id="languageSelector" />}
                    >
                        {[language].map((lng) => (
                            <MenuItem key={lng.iso} value={lng.iso}>
                                {lng.title}
                            </MenuItem>
                        ))}
                    </Select>
                </ListItem>
            </List>
        </Box>
    );
}

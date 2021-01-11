import { Paper, Tab, Tabs, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
    Search as SearchIcon,
    Settings as SettingsIcon,
    Storage as StorageIcon,
    DataUsage as DataUsageIcon,
} from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { rootActions, RootState } from "../../store/reducers";
import SearchPage from "./SearchPage";
import SettingsPage from "./SettingsPage";
import DatabasePage from "./DatabasePage";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",

            background: theme.palette.primary.dark,
        },
        tab: {},
        page: {
            flexGrow: 1,
        },
        // FIXME: Add footer shadow
        footer: {
            flexShrink: 1,
            backgroundColor: theme.palette.type === "light" ? theme.palette.grey[200] : theme.palette.grey[800],
        },
    })
);

export const RootPage: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    // FIXME: I'm tired
    const { literallyUpdateEverything } = rootActions.location;
    const { rootPageIndex } = useSelector((state: RootState) => state.location);

    const pages = [
        { label: "Search", icon: <SearchIcon />, element: <SearchPage /> },
        { label: "Database", icon: <StorageIcon />, element: <DatabasePage /> },
        { label: "Settings", icon: <SettingsIcon />, element: <SettingsPage /> },
    ];

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        dispatch(literallyUpdateEverything({ rootPageIndex: newValue }));
    };

    return (
        <Paper className={classes.root}>
            {pages.map((page, index) => (
                <Paper key={index} hidden={index !== rootPageIndex} className={classes.page}>
                    {page.element}
                </Paper>
            ))}
            <Tabs
                value={rootPageIndex}
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                aria-label="page navigation tabs"
                className={classes.footer}
            >
                {pages.map((page, index) => (
                    <Tab
                        icon={page.icon}
                        label={page.label}
                        aria-label={page.label}
                        key={index}
                        className={classes.tab}
                    />
                ))}
            </Tabs>
        </Paper>
    );
};

export default RootPage;

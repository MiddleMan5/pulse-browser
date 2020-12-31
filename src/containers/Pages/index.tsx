import React, { useEffect, useState } from "react";
import {
    BottomNavigation,
    BottomNavigationAction,
    BottomNavigationActionProps,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Toolbar,
    Typography,
    Tab,
    Tabs,
    TabPage,
    AppBar,
    Theme,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
    ChevronLeft as ChevronLeftIcon,
    DonutLarge as DonutLargeIcon,
    Favorite as FavoriteIcon,
    Home as HomeIcon,
    Menu as MenuIcon,
    Settings as SettingsIcon,
    Storage as StorageIcon,
    Search as SearchIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import HomePage from "./HomePage";
import SettingsPage from "./SettingsPage";
import SearchPage from "./SearchPage";
import FavoritesPage from "./FavoritesPage";
import { useDispatch, useSelector } from "react-redux";
import { rootActions, RootState } from "../../store/reducers";

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
        { label: "Settings", icon: <SettingsIcon />, element: <SettingsPage /> },
    ];

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        dispatch(literallyUpdateEverything({ rootPageIndex: newValue }));
    };

    console.log(rootPageIndex);

    useEffect(() => {
        console.log("Index changed");
    }, [rootPageIndex]);

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

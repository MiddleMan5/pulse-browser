import React, { useEffect } from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
    ListItemText,
    AppBar,
    ListItemIcon,
    ListItem,
    List,
    Drawer,
    Paper,
    Divider,
    Typography,
    Box,
} from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
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

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
        },
        iconBar: {
            position: "relative",
            zIndex: theme.zIndex.drawer + 1,
        },
        menuButton: {
            minWidth: 36,
        },
        menuIcon: {
            minWidth: 0,
        },
        drawer: {
            flexShrink: 0,
            whiteSpace: "nowrap",
            flexDirection: "row",
            width: drawerWidth,
            backgroundColor: theme.palette.primary.dark,
            zIndex: theme.zIndex.drawer,
        },
    })
);

export default function SidePanel() {
    const classes = useStyles();

    const tabs = [
        { label: "Home", icon: <HomeIcon />, content: undefined },
        { label: "Search", icon: <SearchIcon />, content: undefined },
        { label: "Favorites", icon: <FavoriteIcon />, content: undefined },
        { label: "Settings", icon: <SettingsIcon />, content: undefined },
    ];

    // TODO: Find a stock component that tracks selected state (Tab?)
    const [activeTab, setActiveTab] = React.useState<number | undefined>(undefined);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Toggle active action item
    const setActive = (index: number) => {
        setActiveTab(activeTab === index ? undefined : index);
    };

    // Update drawer contents
    useEffect(() => {
        setDrawerOpen(activeTab != null);
    }, [activeTab]);

    return (
        <Paper className={classes.root}>
            <Paper className={classes.iconBar}>
                <List>
                    {tabs.map((tab, index) => (
                        <Tooltip title={tab.label}>
                            <ListItem
                                button
                                key={index}
                                onClick={() => setActive(index)}
                                className={classes.menuButton}
                            >
                                <ListItemIcon className={classes.menuIcon}>{tab.icon}</ListItemIcon>
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Paper>
            {drawerOpen && activeTab != null && (
                <Paper className={classes.drawer}>
                    <Typography variant="subtitle2" noWrap>
                        {tabs[activeTab]?.label}
                    </Typography>
                    <Divider />
                    {tabs[activeTab]?.content ?? <div />}
                </Paper>
            )}
        </Paper>
    );
}

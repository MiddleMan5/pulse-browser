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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    ChevronLeft as ChevronLeftIcon,
    DonutLarge as DonutLargeIcon,
    Favorite as FavoriteIcon,
    Home as HomeIcon,
    Menu as MenuIcon,
    Settings as SettingsIcon,
    Storage as StorageIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect } from "react";
import SearchPage from "./SearchPage";
import SettingsPage from "./SettingsPage";
import { DatabasePanel } from "../components";
import SiteList from "../models/SiteList";
import { RootState } from "../reducers";
import { useDispatch, useSelector } from "react-redux";
import { ipcService } from "../services/ipc.service";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
    },
    // FIXME: Add footer shadow
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: "auto",
        backgroundColor: theme.palette.type === "light" ? theme.palette.grey[200] : theme.palette.grey[800],
        width: "100%",
        position: "fixed",
        bottom: 0,
    },
    toolbar: {
        minHeight: "36px",
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        justifyContent: "flex-end",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
    },
    siteLink: {
        maxHeight: "30px",
    },
    siteLinkIcon: {
        maxHeight: "30px",
    },
}));

interface NavigationMapItem {
    props: BottomNavigationActionProps;
    value: JSX.Element;
}

export const HomePage: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {} = useSelector((state: RootState) => state.settings);

    const [open, setOpen] = React.useState(false);
    const [footerIndex, setFooterIndex] = React.useState(0);
    const [routes] = React.useState<NavigationMapItem[]>([
        {
            props: { key: "home", title: "Home", icon: <HomeIcon /> },
            value: <SearchPage />,
        },
        {
            props: { key: "favorites", title: "Favorites", icon: <FavoriteIcon /> },
            value: <div />,
        },
        {
            props: { key: "database", title: "Database", icon: <StorageIcon /> },
            value: <DatabasePanel />,
        },
        {
            props: { key: "settings", title: "Settings", icon: <SettingsIcon /> },
            value: <SettingsPage />,
        },
    ]);

    return (
        <Box className={classes.root}>
            <Toolbar
                variant="dense"
                className={clsx(classes.appBar, classes.toolbar, {
                    [classes.appBarShift]: open,
                })}
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => setOpen(true)}
                    edge="start"
                    size="small"
                    className={clsx(classes.menuButton, open && classes.hide)}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton size="small" onClick={() => setOpen(false)}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Typography>Sites</Typography>
                <Divider />
                <List>
                    {SiteList.map((site, index) => (
                        <ListItem button key={index} className={classes.siteLink}>
                            <ListItemIcon className={classes.siteLinkIcon}>
                                {site?.props?.icon ? (
                                    <img src={site.props.icon} alt="" className={classes.siteLinkIcon} />
                                ) : (
                                    <DonutLargeIcon className={classes.siteLinkIcon} />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={site?.name} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Paper className={classes.content}>{routes[footerIndex]?.value}</Paper>
            <Box className={classes.footer}>
                <BottomNavigation
                    value={footerIndex}
                    onChange={(event, newValue) => {
                        setFooterIndex(newValue);
                    }}
                    showLabels
                    className={classes.footer}
                >
                    {routes?.map((route) => (
                        <BottomNavigationAction {...route.props} />
                    ))}
                </BottomNavigation>
            </Box>
        </Box>
    );
};

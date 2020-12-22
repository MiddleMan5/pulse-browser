import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Paper,
    Toolbar,
    Typography,
} from "@material-ui/core";
import {
    ChevronLeft as ChevronLeftIcon,
    DonutLarge as DonutLargeIcon,
    Favorite as FavoriteIcon,
    Home as HomeIcon,
    Menu as MenuIcon,
    Settings as SettingsIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect } from "react";
import { LoadableTabPanel, PulseThemeProvider } from "./components";
import { Image, SiteModel } from "./models";
import SiteList from "./SiteList";

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

// TODO: This is just a demo
type SearchMap = { [query: string]: Image[] };

interface HomeProps {}
const Home: React.FC<HomeProps> = ({}) => {
    const classes = useStyles();
    const [searches, setSearches] = React.useState<SearchMap>({});
    const [open, setOpen] = React.useState(false);
    const [footerValue, setFooterValue] = React.useState(0);

    async function loadSites(sites: SiteModel[]) {
        const siteSearches: SearchMap = {};
        for (const site of sites) {
            try {
                console.log("Searching site:", site.name);
                siteSearches[site.name] = await site.images();
            } catch (ex) {
                console.error("Failed to retrieve images from site:", site.name, ex);
            }
        }
        console.log("Found images:", siteSearches);
        return siteSearches;
    }

    // Initial load
    useEffect(() => {
        loadSites(SiteList).then((value) => setSearches(value));
    }, []);

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
            <Paper className={classes.content}>
                <div className={classes.drawerHeader} />
                <LoadableTabPanel searches={Object.entries(searches)} />
            </Paper>
            <BottomNavigation
                value={footerValue}
                onChange={(event, newValue) => {
                    setFooterValue(newValue);
                }}
                showLabels
                className={classes.footer}
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
            </BottomNavigation>
        </Box>
    );
};

export default function App() {
    return (
        <PulseThemeProvider themeName={"DarkTheme"}>
            <CssBaseline />
            <Home />
        </PulseThemeProvider>
    );
}

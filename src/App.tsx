import { Box, Divider, Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { useEffect } from "react";
import { PulseThemeProvider, NavigationFooter, ScrollableTabPanel } from "./components";
import { SiteModel, Image } from "./models";
import SiteList from "./SiteList";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
    },
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: "auto",
        backgroundColor: theme.palette.type === "light" ? theme.palette.grey[200] : theme.palette.grey[800],
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
        maxHeight: "20px",
    },
}));

// TODO: This is just a demo
type SearchMap = { [query: string]: Image[] };

interface HomeProps {}
const Home: React.FC<HomeProps> = ({}) => {
    const classes = useStyles();
    const [searches, setSearches] = React.useState<SearchMap>({});
    const [open, setOpen] = React.useState(false);

    async function loadSites(sites: SiteModel[]) {
        const siteSearches: SearchMap = {};
        for (const site of sites) {
            try {
                console.log("Searching site:", site.name);
                siteSearches[site.name] = await site.images();
            } catch (ex) {
                continue;
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
            <AppBar
                position="static"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(true)}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Pulse Browser
                    </Typography>
                </Toolbar>
            </AppBar>
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
                    <IconButton onClick={() => setOpen(false)}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Typography>Sites</Typography>
                <Divider />
                <List>
                    {SiteList.map((site, index) => (
                        <ListItem button key={index}>
                            <img src={site?.props?.icon ?? ""} alt="" className={classes.siteLink} />
                            <ListItemText primary={site?.props?.uri} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <ScrollableTabPanel searches={Object.entries(searches)} />
                <NavigationFooter />
            </Box>
        </Box>
    );
};

export default function App() {
    return (
        <PulseThemeProvider>
            <CssBaseline />
            <Home />
        </PulseThemeProvider>
    );
}

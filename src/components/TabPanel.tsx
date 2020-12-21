import React, { useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { GalleryView } from "./GalleryView";

interface TabPanelProps {
    index: any;
    value: any;
}

export function TabPanel(props: React.PropsWithChildren<TabPanelProps>) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    tab:{
    },
    panel: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
}));

interface ScrollableTabPanelProps {
    value?: number;
    searches?: any[];
}

export function ScrollableTabPanel(props: React.PropsWithChildren<ScrollableTabPanelProps>) {
    const classes = useStyles();
    const [value, setValue] = React.useState(props?.value ?? 0);
    const [tabs, setTabs] = React.useState<any[]>(props?.searches ?? []);
    useEffect(() => setTabs(props?.searches ?? []), [props.searches]);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    // This is really dumb...
    const newTab = (event: any) => {
        const newTab = [`Search ${tabs.length}`, []];
        setTabs([...tabs, newTab]);
    };

    return (
        <div className={classes.panel}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                  {tabs.map(([name,], index) =>
                      <Tab className={classes.tab} key={`${name}-${index}`} label={name} {...a11yProps(index)}/>
                  )}
                  <Tab label="+" onClick={newTab}/>
                </Tabs>
            </AppBar>
            {tabs.map(([name, searchResults], index) => (
                <TabPanel key={`${name}-${index}`} index={index} value={value}>
                    <GalleryView value={searchResults}/>
                </TabPanel>
            ))}
        </div>
    );
}

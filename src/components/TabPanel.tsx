import { Box, AppBar, Tab, Tabs, IconButton } from "@material-ui/core";
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { SearchTab } from "./SearchTab";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Image, SiteModel } from "../models";
import SiteList from "../models/SiteList";

interface TabPageProps {
    index: any;
    value: any;
}

export function TabPage(props: React.PropsWithChildren<TabPageProps>) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpage"
            hidden={value !== index}
            id={`scrollable-auto-tabpage-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    tab: {},
    panel: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    tabBar: {
        minWidth: 10,
    },
}));

interface TabPanelProps {
    value?: number;
    searches?: any[];
}

export default function TabPanel(props: React.PropsWithChildren<TabPanelProps> | any) {
    const classes = useStyles();
    const [value, setValue] = React.useState(props?.value ?? 0);
    const [tabs, setTabs] = React.useState<any[]>(props?.searches ?? []);
    useEffect(() => setTabs(props?.searches ?? []), [props.searches]);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const removeTab = (index: number) => {
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        setTabs(newTabs);
    };

    const addTab = (event: any) => {
        const newTab = [`Search ${tabs.length}`, []];
        setTabs([...tabs, newTab]);
    };

    return (
        <div className={classes.panel}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    className={classes.tabBar}
                    onChange={handleChange}
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs "
                >
                    {tabs.map(([name, searchResults], index) => (
                        <Tab
                            component="div"
                            className={classes.tab}
                            icon={
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        removeTab(index);
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            }
                            key={`${name}-${index}`}
                            // disableRipple
                            label={name}
                        />
                    ))}
                    <Tab
                        component="div"
                        icon={
                            <IconButton size="small" onClick={addTab}>
                                <AddIcon />
                            </IconButton>
                        }
                        key="new-search-tab"
                        disableRipple
                    />
                </Tabs>
            </AppBar>
            {tabs.map(([name, searchResults], index) => (
                <TabPage key={`${name}-${index}`} index={index} value={value}>
                    <SearchTab value={searchResults} />
                </TabPage>
            ))}
        </div>
    );
}

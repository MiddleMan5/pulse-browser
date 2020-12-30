import { AppBar, Box, Grid, IconButton, Tab, Tabs } from "@material-ui/core";
import { createStyles, fade, makeStyles, Theme } from "@material-ui/core/styles";
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageCard } from "../components/ImageCard";
import { SearchTabBar } from "../components/SearchTabBar";
import { Image, Query } from "../models";
import { rootActions, RootState } from "../reducers";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        tab: {},
        panel: {
            flexGrow: 1,
            width: "100%",
            backgroundColor: theme.palette.background.paper,
        },
        tabBar: {
            minWidth: 10,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            display: "none",

            [theme.breakpoints.up("sm")]: {
                display: "block",
            },
        },
        search: {
            position: "relative",
            flexGrow: 1,
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            "&:hover": {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(1),
                width: "auto",
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: "100%",
            position: "absolute",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        searchSettings: {
            paddingLeft: theme.shape.borderRadius,
            display: "flex",
        },
        searchBar: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            position: "sticky",
        },
        inputRoot: {
            color: "inherit",
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("sm")]: {
                width: "12ch",
                "&:focus": {
                    width: "20ch",
                },
            },
        },
        gallery: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        buttonBar: {
            position: "fixed",
        },
    })
);

interface SearchTabProps {
    title?: string;
    value?: Image[];
}

export function SearchTab(props?: SearchTabProps) {
    const classes = useStyles();

    // Searches
    const [pageNum, setPageNum] = useState(1);
    const [queryStr, setQueryStr] = useState("");
    const [query, setQuery] = useState<Query>({});
    const [results, setResults] = useState<Image[]>(props?.value ?? []);
    const [runCount, setRunCount] = useState(0);

    // Initialize Options
    useEffect(() => {
        // TODO: Site-defined search tokens
        const queryTokens = queryStr.split(" ");
        const newQuery = { tags: [...queryTokens], page: pageNum, limit: undefined };
        setQuery(newQuery);
    }, [queryStr, pageNum]);

    // Update query object
    useEffect(() => {
        // TODO: Site-defined search tokens
        const queryTokens = queryStr.split(" ");
        const newQuery = { tags: [...queryTokens], page: pageNum, limit: undefined };
        setQuery(newQuery);
    }, [queryStr, pageNum]);

    // Perform search with current query
    async function performSearch() {
        // Copy current query
        const siteQuery = { ...query };
    }

    // TODO: This is dumb
    function submitSearch() {
        performSearch().catch(console.error);
    }

    // Re-render on result updates
    useEffect(() => {
        console.log("Rendering results...");
    }, [results, runCount]);

    return (
        <Box className={classes.root}>
            <SearchTabBar onSubmit={submitSearch} />
            <Grid
                container
                direction="row-reverse"
                justify="center"
                alignItems="flex-start"
                spacing={2}
                className={classes.gallery}
            >
                {results.map((img) => (
                    <Grid key={img.uri} item>
                        <ImageCard image={img.uri} title={img.uri} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export interface TabPageProps {
    index: number;
    value: number;
    key: string;
}
export const TabPage: React.FC<TabPageProps> = (props) => {
    const { children, value, index, key } = props;

    return (
        <div
            role="tabpage"
            hidden={value !== index}
            id={`scrollable-auto-tabpage-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            key={key}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
};

export const SearchPage: React.FC = () => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const searches = useSelector((state: RootState) => state.searches.entities);
    //const {} = useSelector((state: RootState) => state.searches);
    const [value, setValue] = useState(0);

    // Build tabs from active searches
    const tabs = Object.entries(searches).map(([id, search]) => {
        const result: [string, Image[]] = [id, search?.results ?? []];
        return result;
    });

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const removeTab = (index: number) => {
        dispatch(rootActions.searches.removeSearch(index));
    };

    const addTab = (event: any) => {
        dispatch(rootActions.searches.addSearch({ id: `${tabs.length}`, tags: [], options: {}, results: [] }));
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
                    {tabs.map(([id, searchResults], index) => (
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
                            key={`${id}-${index}`}
                            // disableRipple
                            label={id}
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
};

export default SearchPage;

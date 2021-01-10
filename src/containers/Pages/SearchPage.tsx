import {
    AppBar,
    Box,
    Grid,
    IconButton,
    Tab,
    Tabs,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@material-ui/core";
import { createStyles, fade, makeStyles, Theme } from "@material-ui/core/styles";
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageCard } from "../../components/ImageCard";
import { SearchBar } from "../../components/SearchBar";
import { ImageEntity, Query } from "../../models";
import { rootActions, RootState } from "../../store/reducers";
import { usePulse } from "../../store/database";
import { PicsumSite } from "../../sites/picsum.site";
import { RestConnector } from "../../connectors";

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
        siteList: {
            flexDirection: "column",
        },
        siteGroup: {
            color: theme.palette.primary.light,
            display: "inline",
        },
        gallery: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        buttonBar: {
            position: "fixed",
        },
        activeTab: {
            marginTop: theme.spacing(2),
        },
    })
);

interface SearchTabProps {
    searchId: string;
}

// FIXME: Tech demo
const picsum = new PicsumSite();

export const SearchTab: React.FC<SearchTabProps> = ({ searchId }) => {
    const classes = useStyles();
    const pulse = usePulse();
    const [siteResults, setSiteResults] = useState<[RestConnector, ImageEntity[]][]>([[picsum, []]]);

    const dispatch = useDispatch();
    const { updateSearch } = rootActions.searches;
    const searchState = useSelector((state: RootState) => state.searches.entities[searchId]!);
    const { id, query, options } = searchState;

    // TODO: Handle site updates with workers
    function submitSearch(newQuery: Query) {
        dispatch(updateSearch({ id, changes: { query: newQuery } }));
    }

    useEffect(() => {
        (async () => {
            const siteImages = await picsum.images(query);
            console.log("Got images:", siteImages);
            setSiteResults([[picsum, siteImages]]);
        })().catch((err) => console.error(err));
    }, [query]);

    return (
        <Box className={classes.root}>
            <SearchBar query={query} options={options} onSubmit={submitSearch} />

            <List className={classes.siteList}>
                {siteResults.map(([site, images]) => (
                    <ListItem divider className={classes.siteGroup}>
                        <ListItemText primary={site.name} />
                        <Grid
                            container
                            direction="row-reverse"
                            justify="center"
                            alignItems="flex-start"
                            spacing={2}
                            className={classes.gallery}
                        >
                            {images.map((img) => (
                                <Grid key={img.uri} item>
                                    <ImageCard image={img.uri} title={img.uri} />
                                </Grid>
                            ))}
                        </Grid>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export const SearchPage: React.FC = () => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const { addSearch, removeSearch } = rootActions.searches;

    const [activeTab, setActiveTab] = useState<number | string | undefined>(undefined);
    const searches = useSelector((state: RootState) => state.searches.entities);

    // Get ids for searches
    const searchList = Object.keys(searches);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setActiveTab(newValue);
    };

    const addTab = (event: any) => {
        const result = dispatch(addSearch({}));
        const searchId = result!.payload!.id!;
        console.log("Got new tab:", searchId);
    };

    const removeTab = (id: string) => {
        if (activeTab === id) {
            setActiveTab(0);
        }
        dispatch(removeSearch(id));
    };

    return (
        <div className={classes.panel}>
            <AppBar position="static" color="default">
                <Tabs
                    value={activeTab ?? 0}
                    className={classes.tabBar}
                    onChange={handleChange}
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs "
                >
                    {searchList.map((id, index) => (
                        <Tab
                            component="div"
                            className={classes.tab}
                            value={id}
                            icon={
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        removeTab(id);
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            }
                            key={`${id}-${index}`}
                            label={(searches[id]?.query?.tags?.length ? searches[id]!.query.tags! : ["search"]).join(
                                " "
                            )}
                        />
                    ))}
                    <Tab
                        value={0}
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
            {searchList.map((id) =>
                id === activeTab ? (
                    <Paper key={id} hidden={id !== activeTab} className={classes.activeTab}>
                        <SearchTab key={id} searchId={id} />
                    </Paper>
                ) : undefined
            )}
        </div>
    );
};

export default SearchPage;

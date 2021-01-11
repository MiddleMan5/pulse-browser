import {
    AppBar,
    Box,
    Button,
    Chip,
    CircularProgress,
    ClickAwayListener,
    FormGroup,
    Grid,
    Grow,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Popper,
    Switch,
    Tab,
    Tabs,
} from "@material-ui/core";
import { createStyles, fade, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Add as AddIcon, Close as CloseIcon } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageCard } from "../../components/ImageCard";
import { PouchDBError } from "../../components/PouchDBError";
import { Query, Tag } from "../../models";
import { useCollection } from "../../store/database";
import { rootActions, RootState } from "../../store/reducers";
import { SearchOptions } from "../../store/reducers/searches";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        tab: {},
        searchBar: {
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            "& > * + *": {
                marginTop: theme.spacing(3),
            },
            flexWrap: "nowrap",
            position: "sticky",
        },
        buttonBar: {
            display: "flex",
            flexDirection: "row",
        },
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
        activeTab: {
            marginTop: theme.spacing(2),
        },
    })
);

interface SearchOptionProps {
    label: string;
    value: boolean | string;
    onChange: () => void;
}

// TODO: This is a little weird
export function SearchOption(props: SearchOptionProps) {
    const { label, value, onChange } = props;
    if (typeof value === "boolean") {
        return <Switch size="small" checked={value} onChange={onChange} />;
    } else if (typeof value === "string") {
        return <TextField size="small" label={label} value={value} onChange={onChange} />;
    } else {
        return <div />;
    }
}

export interface OptionsMenuButtonProps {
    onSubmit?: () => void;
}

export function OptionsMenuButton(props: React.PropsWithChildren<OptionsMenuButtonProps>) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    // FIXME: Redux
    const [state, setState] = React.useState({});
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const handleToggle = () => {
        setOpen((openState) => !openState);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (anchorRef?.current?.contains(event.target as HTMLElement)) {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <Button
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                Options
            </Button>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <FormGroup>
                                    <List>
                                        {/* {state.sites.map((siteSwitch, index) => {
                                            const setSiteSwitch = (checked: boolean) => {
                                                if (siteSwitch.checked !== checked) {
                                                    state.sites[index].checked = checked;
                                                    setState(state);
                                                }
                                            };
                                            return (
                                                <ListItem>
                                                    <ListItemText primary={siteSwitch.label} />
                                                    <Switch
                                                        size="small"
                                                        checked={siteSwitch.checked}
                                                        onChange={(e) => setSiteSwitch(e.target.checked)}
                                                    />
                                                </ListItem>
                                            );
                                        })} */}
                                    </List>
                                </FormGroup>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

export interface SearchBarProps {
    searchId: string;
    onSubmit: (query: Query) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchId, onSubmit }) => {
    const classes = useStyles();

    const [rows, loading, error, collection] = useCollection("tags", { include_docs: true });
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();

    const { updateSearch } = rootActions.searches;
    const searchState = useSelector((state: RootState) => state.searches.entities[searchId]);
    const id = searchState?.id;
    const query = searchState?.query ?? { limit: 0, page: 0, tags: [] };
    const [queryTags, setQueryTags] = useState<string[]>(query.tags);
    const tagList = [...new Set((rows ?? []).map((row) => row.doc?.tag ?? ""))];

    // FIXME: Handle null search better
    if (id == null) {
        return <div />;
    }

    const submitQuery = (data: Partial<Query>) => {
        const newQuery = {
            ...query,
            ...data,
        };
        dispatch(updateSearch({ id, changes: { query: newQuery } }));
    };

    return (
        <div className={classes.searchBar}>
            <Autocomplete
                className={classes.searchBar}
                multiple
                id="tags-outlined"
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                onChange={(event, value) => setQueryTags(value)}
                loading={loading}
                options={tagList}
                noOptionsText="No tags loaded"
                defaultValue={queryTags}
                filterSelectedOptions
                freeSolo
                renderTags={(tags: string[], getTagProps) =>
                    tags.map((option: string, index: number) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Tags"
                        placeholder="Search"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
            <Box className={classes.buttonBar}>
                <Button onClick={() => submitQuery({ tags: queryTags })}>Search</Button>
                <Button onClick={() => submitQuery({ page: query.page! - 1 })}>{"<"}</Button>
                {query.page}
                <Button onClick={() => submitQuery({ page: query.page! + 1 })}>{">"}</Button>
                <OptionsMenuButton />
            </Box>
        </div>
    );
};

interface SearchTabProps {
    searchId: string;
}

export const SearchTab: React.FC<SearchTabProps> = ({ searchId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { updateSearch } = rootActions.searches;
    const searchState = useSelector((state: RootState) => state.searches.entities[searchId]);

    const id = searchState?.id;
    const query = searchState?.query ?? { limit: 0, page: 0, tags: [] };
    const limit = query?.limit ?? 0;
    const skip = (query?.page ?? 0) * limit;

    const [rows, loading, error, collection] = useCollection("index", { limit, skip, include_docs: true });

    // TODO: Match tag aliases
    // TODO: Add selector options to useCollection
    // FIXME: This is going to cause incorrect pagination
    const matchingRows = rows.filter((row) => {
        const docTags: Tag[] = (row?.doc as any)?.tags ?? [];
        for (const tag in query.tags) {
            if (!docTags.includes(tag)) {
                return false;
            }
        }
        return true;
    });

    // FIXME: Handle null search better
    if (id == null) {
        return <div />;
    }

    // TODO: Handle site updates with workers
    const submitSearch = (newQuery: Query) => {
        dispatch(updateSearch({ id, changes: { query: newQuery } }));
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error != null) {
        return <PouchDBError {...error} />;
    }

    return (
        <Box className={classes.root}>
            <SearchBar searchId={searchId} onSubmit={submitSearch} />

            <List className={classes.siteList}>
                <ListItem divider className={classes.siteGroup}>
                    <ListItemText primary="Site.name" />
                    <Grid
                        container
                        direction="row-reverse"
                        justify="center"
                        alignItems="flex-start"
                        spacing={2}
                        className={classes.gallery}
                    >
                        {matchingRows.map((doc) => (
                            <Grid key={doc.key} item>
                                <ImageCard documentId={doc.id} />
                            </Grid>
                        ))}
                    </Grid>
                </ListItem>
            </List>
        </Box>
    );
};

export const SearchPage: React.FC = () => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const { addSearch, removeSearch } = rootActions.searches;

    const [activeTab, setActiveTab] = useState<string>("ADD_NEW_TAB");
    const searches = useSelector((state: RootState) => state.searches.entities);

    // Get ids for searches
    const searchList = Object.keys(searches);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setActiveTab(newValue);
    };

    const addTab = (event: any) => {
        const result = dispatch(addSearch({}));
        const searchId = result!.payload!.id!;
        setActiveTab(searchId);
    };

    const removeTab = (id: string) => {
        if (activeTab === id) {
            setActiveTab("ADD_NEW_TAB");
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
                        value="ADD_NEW_TAB"
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
            <Paper className={classes.activeTab}>
                <SearchTab key={activeTab} searchId={activeTab} />
            </Paper>
        </div>
    );
};

export default SearchPage;

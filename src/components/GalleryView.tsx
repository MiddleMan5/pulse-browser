import {
    Box,
    Button,
    Grid,
    Menu,
    Switch,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Popper,
    Paper,
    ClickAwayListener,
    MenuList,
    Grow,
} from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import { createStyles, fade, makeStyles, Theme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { Image } from "../models";
import { ImageCard } from "./ImageCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            
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
    })
);

export interface OptionsMenuButtonProps {}

export function OptionsMenuButton(props: React.PropsWithChildren<OptionsMenuButtonProps>) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
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
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
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
                            <ClickAwayListener onClickAway={handleClose}>{props.children}</ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

interface GalleryViewProps {
    title?: string;
    value?: Image[];
}

export function GalleryView(props?: GalleryViewProps) {
    const classes = useStyles();
    const [query, setQuery] = useState("");
    const [queries, setQueries] = useState<string[]>([]);
    const [results, setResults] = useState<Image[]>(props?.value ?? []);

    function submitSearch() {
        setQueries([...queries, query]);
    }

    // Switches
    const number = queries.length;
    const switchState: { [name: string]: boolean } = {
        "simple option": false,
        "a really long toggle option": false,
        // TODO: This doesn't re-render properly
        //[`option with variable label: ${number}`]: false,
        "another option": false,
    };
    console.log(switchState);
    const [switches, setSwitches] = React.useState(switchState);

    const toggleChecked = (name: string) => {
        setSwitches({ ...switches, [name]: !switches[name] });
    };

    return (
        <Box className={classes.root}>
            <Box className={classes.searchBar}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search"
                        onChange={(e) => setQuery(e.target.value)}
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ "aria-label": "search" }}
                    />
                </div>
                <Button type="submit" onClick={submitSearch}>
                    Submit
                </Button>
                <OptionsMenuButton>
                    <FormGroup>
                        {Object.entries(switches).map(([name, value], index) => (
                            <FormControlLabel
                                key={`label-${index}`}
                                control={<Switch size="small" checked={value} onChange={() => toggleChecked(name)} />}
                                label={name}
                            />
                        ))}
                    </FormGroup>
                </OptionsMenuButton>
            </Box>
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

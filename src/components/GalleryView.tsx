import React, { useState } from "react";
import { AppBar, Toolbar, Grid, Container, Box, Button, Menu, MenuItem } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { createStyles, fade, Theme, makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import { ImageCard } from "./ImageCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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

interface GalleryViewProps {
    title?: string;
}

export function GalleryView(props?: GalleryViewProps) {
    const classes = useStyles();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);

    function submitSearch() {
        setResults([...results, query]);
    }
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box>
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
                <div className={classes.searchSettings}>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        Options
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </div>
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
                    <Grid key={img} item>
                        <ImageCard image={img} title={img} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

/* eslint-disable no-use-before-define */
import { Box, Button, ClickAwayListener, FormGroup, Grow, Paper, Popper, Switch, Chip } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import { Tag } from "../models";
import { pulseDatabase } from "../PulseDatabase";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexDirection: "row",
            "& > * + *": {
                marginTop: theme.spacing(3),
            },
        },
        searchBar: {
            flexGrow: 1,
        },
        buttonBar: {
            display: "flex",
            flexDirection: "row",
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

interface OptionState {
    option1: boolean;
}

export interface OptionsMenuButtonProps {
    onSubmit?: () => void;
}

export function OptionsMenuButton(props: React.PropsWithChildren<OptionsMenuButtonProps>) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [state, setState] = React.useState<OptionState>({ option1: true });
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
                            <ClickAwayListener onClickAway={handleClose}>
                                <FormGroup>
                                    <Switch
                                        size="small"
                                        checked={state.option1}
                                        onChange={(e) => setState({ ...state, option1: e.target.checked })}
                                    />
                                </FormGroup>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

export interface SearchTabBarProps {
    onSubmit: () => void;
}

export function SearchTabBar(props?: SearchTabBarProps) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [tagList, setTagList] = React.useState<Tag[]>([]);
    const loading = open && tagList.length === 0;

    // Load tags from sites
    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const tags = await pulseDatabase.tags();
            if (active) {
                setTagList(tags);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setTagList([]);
        }
    }, [open]);

    const onSubmit = () => {
        console.log("GOT SUBMIT");
        if (props?.onSubmit) {
            props.onSubmit();
        }
    };

    return (
        <div className={classes.root}>
            <Autocomplete
                className={classes.searchBar}
                multiple
                id="tags-outlined"
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                loading={loading}
                options={tagList}
                noOptionsText="No tags loaded"
                defaultValue={[]}
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
                <Button onClick={onSubmit}>Search</Button>
                <OptionsMenuButton />
            </Box>
        </div>
    );
}

import {
    Container,
    Box,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
    Switch,
    TextField,
    Tooltip,
    IconButton,
    CircularProgress,
} from "@material-ui/core";

import { Add as AddIcon, Delete as DeleteIcon } from "@material-ui/icons";

import { makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import { pulseDatabase, Collection } from "../PulseDatabase";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        flexDirection: "row",
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    collection: {},
}));

export interface CollectionItemProps {
    collection: Collection;
    removeCollection?: (name: string) => void;
}

export function CollectionItem({ collection, removeCollection }: CollectionItemProps) {
    const classes = useStyles();

    return (
        <ListItem className={classes.collection}>
            <ListItemText id={`collection-list-label-${collection.name}`} primary={collection.name} />
            <ListItemText id={`collection-list-value-${collection.name}`} primary={collection.fields.join(", ")} />
            <ListItemSecondaryAction>
                <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeCollection && removeCollection(collection.name)}
                >
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
            {/* <ListItemSecondaryAction>{inputElement}</ListItemSecondaryAction> */}
        </ListItem>
    );
}

export function DatabaseControls() {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState<Collection[]>([]);

    // Load tags from sites
    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await pulseDatabase.init();
            const dbCollections = await pulseDatabase.collections();
            if (active) {
                console.log("Got collections:", dbCollections);
                setCollections(dbCollections);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    // Load tags from sites
    React.useEffect(() => {
        if (collections.length) {
            console.log("Rendering collections:", collections);
            setLoading(false);
        }
    }, [collections]);

    const addCollection = () => {
        (async () => {
            await pulseDatabase.createCollection({ name: `Test ${collections.length}`, fields: [] });
            setLoading(true);
        })();
    };

    const removeCollection = (name: string) => {
        (async () => {
            await pulseDatabase.removeCollection(name);
            setLoading(true);
        })();
    };

    return (
        <Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <List subheader={<ListSubheader>Collections</ListSubheader>}>
                    {collections.map((collection) => (
                        <CollectionItem collection={collection} removeCollection={removeCollection} />
                    ))}
                    {/* <ListItem>
                        <ListItemText id={`collection-list-create-collection`} primary="Create collection" />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="add" onClick={addCollection}>
                                <AddIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem> */}
                </List>
            )}
        </Box>
    );
}

export interface DatabasePanelProps {}

export default function DatabasePanel(props: React.PropsWithChildren<DatabasePanelProps> | any) {
    const classes = useStyles();
    return (
        <Container className={classes.root}>
            <DatabaseControls />
            {props?.children}
        </Container>
    );
}

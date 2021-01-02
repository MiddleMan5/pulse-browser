import {
    Box,
    CircularProgress,
    Container,
    Dialog,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Delete as DeleteIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { DocumentTable } from "../../components/DocumentTable";
import { AnyDocument, Collection, usePulse } from "../../store/database";
import { noOp } from "../../util";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        flexDirection: "row",
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    collection: {},
    collectionDialog: {},
}));

export interface CollectionItemProps {
    collection: Collection;
    onClick?: (name: string) => void;
    removeCollection?: (name: string) => void;
}

export const CollectionItem: React.FC<CollectionItemProps> = ({ collection, onClick, removeCollection }) => {
    const classes = useStyles();
    const handleClick = () => (onClick ?? noOp)(collection.name);
    const handleRemove = () => (removeCollection ?? noOp)(collection.name);

    return (
        <ListItem button onClick={handleClick} className={classes.collection}>
            <ListItemText id={`collection-list-label-${collection.name}`} primary={collection.name} />
            <ListItemText id={`collection-list-value-${collection.name}`} primary={collection.fields.join(", ")} />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={handleRemove}>
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export interface CollectionDialogProps extends DialogProps {
    collection: Collection;
}

export const CollectionDialog: React.FC<CollectionDialogProps> = ({ collection, open, onClose, ...dialogProps }) => {
    const descriptionElementRef = React.useRef<HTMLElement>(null);
    const pulse = usePulse();
    // Fixme: Document type
    const [documents, setDocuments] = React.useState<AnyDocument[]>([]);
    const [loading, setLoading] = useState(true);
    React.useEffect(() => {
        let active = true;
        if (open) {
            setLoading(true);
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }

            (async () => {
                if (active) {
                    const results = await pulse.db.find({
                        selector: {
                            collection: collection.name,
                        },
                    });
                    setDocuments(results.docs);
                }
            })().catch((err) => console.error(err));
        }
        return () => {
            active = false;
            setLoading(false);
        };
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll="paper"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            {...dialogProps}
        >
            <DialogTitle
                id="scroll-dialog-title"
                style={{ textTransform: "capitalize" }}
            >{`${collection.name} Contents`}</DialogTitle>
            <DialogContent dividers={true}>
                <DocumentTable options={{}} />
            </DialogContent>
        </Dialog>
    );
};

export function DatabaseControls() {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [activeCollectionName, setActiveCollectionName] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const pulse = usePulse();

    // Load collections
    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            if (active) {
                await pulse.init();
                const dbCollections = await pulse.collections();
                setCollections(dbCollections);
            }
        })().catch((err) => console.error(err));

        return () => {
            active = false;
        };
    }, [loading]);

    const activeCollection = collections.find((c) => c.name === activeCollectionName);

    // Load tags from sites
    React.useEffect(() => {
        if (collections.length) {
            if (!activeCollection) {
                setActiveCollectionName(collections[0].name);
            }
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [collections]);

    const addCollection = () => {
        (async () => {
            await pulse.createCollection({ name: `Test ${collections.length}`, fields: [] });
            setLoading(true);
        })().catch((err) => console.error(err));
    };

    const removeCollection = (name: string) => {
        (async () => {
            await pulse.removeCollection(name);
            setLoading(true);
        })().catch((err) => console.error(err));
    };

    const openCollectionDialog = (name: string) => {
        setActiveCollectionName(name);
        setShowDialog(true);
    };

    return (
        <Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <List subheader={<ListSubheader>Collections</ListSubheader>}>
                    {collections.map((collection) => (
                        <CollectionItem
                            key={collection.name}
                            collection={collection}
                            removeCollection={removeCollection}
                            onClick={openCollectionDialog}
                        />
                    ))}
                </List>
            )}
            {activeCollection && (
                <CollectionDialog
                    collection={activeCollection}
                    open={showDialog}
                    onClose={() => setShowDialog(false)}
                    className={classes.collectionDialog}
                    fullWidth
                    maxWidth="lg"
                />
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

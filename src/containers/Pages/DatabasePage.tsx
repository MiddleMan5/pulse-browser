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
import { Alert, AlertTitle } from "@material-ui/lab";
import React, { useState } from "react";
import { CollectionTable } from "../../components/CollectionTable";
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

export interface CollectionDialogProps extends DialogProps {
    name: string;
}

export const CollectionDialog: React.FC<CollectionDialogProps> = ({ name, open, onClose, ...dialogProps }) => {
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
            >{`${name} Contents`}</DialogTitle>
            <DialogContent dividers={true}>
                <CollectionTable name={name} />
            </DialogContent>
        </Dialog>
    );
};

export interface CollectionItemProps {
    name: string;
    onClick?: (name: string) => void;
    removeCollection?: (name: string) => void;
}

export const CollectionItem: React.FC<CollectionItemProps> = ({ name, onClick, removeCollection }) => {
    const classes = useStyles();

    const pulse = usePulse();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | any | undefined>();
    const [fields, setFields] = useState<string[]>([]);

    const handleClick = () => (onClick ?? noOp)(name);
    const handleRemove = () => (removeCollection ?? noOp)(name);

    React.useEffect(() => {
        if (!loading) {
            setLoading(true);
            (async () => {
                const collection = pulse.collection(name);
                setFields((await collection.fields()).sort());
                setLoading(false);
            })()
                .catch((err) => setError(err))
                .finally(() => setLoading(false));
        }
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error != null) {
        // TODO: Find a way to use usePouch errors
        return (
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                <strong>{error?.name ?? "Failed to load documents"}</strong>:{" "}
                {error?.message ?? "No information was provided"}
            </Alert>
        );
    }

    return (
        <ListItem button onClick={handleClick} className={classes.collection}>
            <ListItemText id={`collection-list-label-${name}`} primary={name} />
            <ListItemText id={`collection-list-value-${name}`} primary={fields.join(", ")} />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={handleRemove}>
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export interface DatabasePageProps {}

export default function DatabasePage(props: React.PropsWithChildren<DatabasePageProps> | any) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [activeCollectionName, setActiveCollectionName] = useState<string | undefined>();
    const [collectionNames, setCollectionNames] = useState<string[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const pulse = usePulse();

    // Load collections
    React.useEffect(() => {
        if (!loading) {
            setLoading(true);
            (async () => {
                const collections = await pulse.collections();
                setCollectionNames(collections.map((c) => c.name).sort());
                setLoading(false);
            })()
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, []);

    const openCollectionDialog = (name: string) => {
        setActiveCollectionName(name);
        setShowDialog(true);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container className={classes.root}>
            <Box>
                <List subheader={<ListSubheader>Collections</ListSubheader>}>
                    {collectionNames.map((name) => (
                        <CollectionItem
                            key={name}
                            name={name}
                            removeCollection={() => {}}
                            onClick={openCollectionDialog}
                        />
                    ))}
                </List>
                <CollectionDialog
                    open={showDialog && activeCollectionName != null}
                    name={activeCollectionName!}
                    onClose={() => setShowDialog(false)}
                    className={classes.collectionDialog}
                    fullWidth
                    maxWidth="lg"
                />
            </Box>
            {props?.children}
        </Container>
    );
}

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
import { PouchDBError } from "../../components";
import { CollectionTable } from "../../components/CollectionTable";
import { AnyDocument, Collection, usePulse, useCollection } from "../../store/database";
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
}

export const CollectionItem: React.FC<CollectionItemProps> = ({ name, onClick }) => {
    const classes = useStyles();

    const [docs, loading, error, collection] = useCollection(name);
    const [fields, setFields] = useState<string[]>([]);

    const handleClick = () => (onClick ?? noOp)(name);

    React.useEffect(() => {
        if (!loading) {
            (async () => {
                setFields((await collection.fields()).sort());
            })().catch((err) => console.error(err));
        }
    }, [loading]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error != null) {
        return <PouchDBError {...error} />;
    }

    const destroyCollection = () => {
        console.log("Destroying collection:", collection.name);
        collection.destroy().catch((err) => console.error(err));
    };

    return (
        <ListItem button onClick={handleClick} className={classes.collection}>
            <ListItemText id={`collection-list-label-${name}`} primary={name} />
            <ListItemText id={`collection-list-value-${name}`} primary={fields.join(", ")} />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => destroyCollection()}>
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
                        <CollectionItem key={name} name={name} onClick={openCollectionDialog} />
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

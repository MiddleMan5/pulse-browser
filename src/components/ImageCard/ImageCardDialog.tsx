import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Draggable from "react-draggable";
import { useImage } from "../../models";
import { CircularProgress } from "@material-ui/core";
import { PouchDBError } from "../PouchDBError";

function PaperComponent(props: PaperProps) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

const useStyles = makeStyles({
    root: {
        maxWidth: "90%",
    },
    // TODO: Something quirky is going on with the full size image size
    imageDialogContent: {
        maxWidth: "100%",
        maxHeight: "100%",
    },
});

export interface ImageCardDialogProps {
    open: boolean;
    onClose: () => void;
    documentId: string;
}

export const ImageCardDialog: React.FC<ImageCardDialogProps> = ({ documentId, children, onClose, open }) => {
    const classes = useStyles();
    const [image, loading, error] = useImage(documentId);

    // TODO: This may cause infinite loading issues
    if (loading || image == null) {
        return <CircularProgress />;
    }

    if (error != null) {
        return <PouchDBError {...error} />;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            fullWidth
            classes={{ paperFullWidth: classes.root }}
            className={classes.root}
        >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                {image.name}
            </DialogTitle>
            <DialogContent>
                <img src={image.data} className={classes.imageDialogContent} />
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

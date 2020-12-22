import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Draggable from "react-draggable";

function PaperComponent(props: PaperProps) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export interface ImageCardDialogProps {
    open: boolean,
    title: any,
    onClose: () => void;
};

const useStyles = makeStyles({
    root: {
        maxWidth: "90%",
    },
});

export function ImageCardDialog(props: React.PropsWithChildren<ImageCardDialogProps>) {
    const classes = useStyles();
    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            fullWidth
            classes={{ paperFullWidth: classes.root }}
            className={classes.root}
        >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                {props.title}
            </DialogTitle>
            <DialogContent>
                {props.children}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

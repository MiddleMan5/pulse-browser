import React from "react";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { CircularProgress } from "@material-ui/core";

interface Props {
    open: boolean;
    onClose: () => void;
}

const ProgressDialog = (props: Props) => (
    <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle data-tid="progressDialogTitle">{/* {i18n.t('core:importDialogTitle')} */}</DialogTitle>
        <DialogContent
            style={{
                marginLeft: "auto",
                marginRight: "auto",
                flexGrow: 1,
            }}
        >
            <CircularProgress size={24} />
        </DialogContent>
    </Dialog>
);

export default ProgressDialog;

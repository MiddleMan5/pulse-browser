import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import { SketchPicker, ColorResult } from "react-color";

const presetColors = [
    "#ffffff",
    "#000000",
    "#ac725e",
    "#d06b64",
    "#f83a22",
    "#fa573c",
    "#ff7537",
    "#ffad46",
    "#42d692",
    "#008000",
    "#7bd148",
    "#fad165",
    "#FFCC24",
    "#92e1c0",
    "#9fe1e7",
    "#9fc6e7",
    "#4986e7",
    "#9a9cff",
    "#b99aff",
    "#c2c2c2",
    "#cabdbf",
    "#cca6ac",
    "#f691b2",
    "#cd74e6",
    "#a47ae2",
];

interface Props {
    classes: any;
    open: boolean;
    color: string;
    setColor: (color: string) => void;
    presetColors?: Array<string>;
    onClose: () => void;
}

const styles = {
    noBorder: {
        padding: "0 !important",
        boxShadow: "none !important",
        backgroundColor: "transparent !important",
    },
};

const ColorPickerDialog = (props: Props) => {
    const [color, setColor] = useState(undefined);
    const [colorHex, setColorHex] = useState(undefined);
    const { open = false, onClose } = props;

    function onConfirm() {
        if (color && colorHex) {
            const hexAlphaColor = colorHex + Math.round(color.a * 255).toString(16);
            props.setColor(hexAlphaColor);
        }
        props.onClose();
    }

    function handleChangeComplete(newColor: ColorResult) {
        setColor(newColor.rgb);
        setColorHex(newColor.hex);
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            keepMounted
            scroll="paper"
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    event.stopPropagation();
                    onConfirm();
                } else if (event.key === "Escape") {
                    onClose();
                }
            }}
        >
            <DialogTitle data-tid="colorPickerDialogTitle">Tag Color</DialogTitle>
            <DialogContent
                style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <SketchPicker
                    className={props.classes.noBorder}
                    presetColors={props.presetColors ? props.presetColors : presetColors}
                    color={color ?? props.color}
                    onChangeComplete={handleChangeComplete}
                />
            </DialogContent>
            <DialogActions>
                <Button data-tid="colorPickerCloseDialog" onClick={props.onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} data-tid="colorPickerConfirm" color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withStyles(styles)(ColorPickerDialog);

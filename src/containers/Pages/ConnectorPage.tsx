import {
    Box,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    DialogTitle,
    DialogContentText,
    DialogContent,
    Dialog,
    DialogActions,
    Select,
    Input,
    MenuItem,
    FormGroupProps,
    FormControlLabel,
    Checkbox,
    Divider,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Folder as FolderIcon, Http as HttpIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LocalConnector, RestConnector, useConnector } from "../../connectors";
import { usePulse } from "../../store/database";
import { useForm } from "react-hook-form";
import { AnyObject } from "../../models";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        connectorConfig: {
            padding: "5px",
            borderStyle: "solid",
            borderColor: theme.palette.primary.dark,
            borderWidth: "1px",
        },
    })
);

export interface NewConnectorFormProps {
    onClose: () => void;
}

export const NewConnectorForm: React.FC<NewConnectorFormProps> = ({ onClose }) => {
    const classes = useStyles();
    const connectors = useConnector([LocalConnector.name, RestConnector.name]);
    const [connectorId, setConnectorId] = useState(0);
    const connectorConfig = connectors[connectorId].config;
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data) => {
        console.log(data);
        onClose();
    };
    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Select
                name="Datsource"
                value={connectorId}
                ref={register}
                onChange={(e) => setConnectorId(e.target.value as number)}
            >
                {connectors.map((d, i) => (
                    <MenuItem value={i}>{d.name}</MenuItem>
                ))}
            </Select>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                fullWidth
                placeholder="Name"
                name="name"
                inputRef={register({ pattern: /^[^\s]*$/i })}
            />

            <Divider />
            <div className={classes.connectorConfig}>
                <DialogContentText>Config:</DialogContentText>

                {Object.entries(connectorConfig).map(([k, v]) => {
                    switch (typeof v) {
                        case "boolean":
                            return (
                                <FormControlLabel
                                    value={k}
                                    style={{ margin: 0 }}
                                    control={<Checkbox name={k} inputRef={register} color="primary" />}
                                    label={k}
                                    labelPlacement="start"
                                />
                            );
                        case "number":
                            return (
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    fullWidth
                                    type="text"
                                    placeholder={`${v ?? k}`}
                                    name={k}
                                    label={k}
                                    inputRef={register}
                                />
                            );
                        case "string":
                            // FIXME: Icon selector
                            if (v.startsWith("data:image")) {
                                return <img src={v} width="30px" draggable="false" />;
                            }
                            return (
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    fullWidth
                                    type="text"
                                    placeholder={v ?? k}
                                    name={k}
                                    label={k}
                                    inputRef={register}
                                />
                            );
                    }
                    return <p>{`${k}:${v}`}</p>;
                })}
            </div>
            <Button type="submit" color="primary">
                Submit
            </Button>
            <Button onClick={() => onClose()} color="primary">
                Cancel
            </Button>
        </form>
    );
};

export const ConnectorPage: React.FC = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const pulse = usePulse();
    const [local] = useConnector([LocalConnector.name]);
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = React.useState(false);

    useEffect(() => {
        (async () => {
            if (!loading) {
                setLoading(true);
                const collection = pulse.collection("index");
                const docs = await local?.find();
                if (docs) {
                    await collection.insert(docs);
                }
            }
        })().catch((err) => console.error(err));
    }, []);

    const newConnector = (e: React.FormEvent<HTMLFormElement>) => {
        console.log(e.target?.value);
        setOpenDialog(false);
    };

    return (
        <Box className={classes.root}>
            <List>
                <ListItem>
                    <ListItemText primary={local?.name} />
                    <ListItemText primary={local?.config.directory} />
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                </ListItem>
            </List>

            <div>
                <Button variant="outlined" color="primary" onClick={() => setOpenDialog(true)}>
                    Add Connector
                </Button>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New Connector</DialogTitle>

                    <DialogContent>
                        <NewConnectorForm onClose={() => setOpenDialog(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </Box>
    );
};

export default ConnectorPage;

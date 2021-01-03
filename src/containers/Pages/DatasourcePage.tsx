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
import { LocalDatasource, RestDatasource, useDatasource } from "../../datasources";
import { PicsumSite } from "../../sites/picsum.site";
import { usePulse } from "../../store/database";
import { useForm } from "react-hook-form";
import { AnyObject } from "../../models";

// FIXME: Tech demo
const picsum = new PicsumSite();

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        datasourceConfig: {
            padding: "5px",
            borderStyle: "solid",
            borderColor: theme.palette.primary.dark,
            borderWidth: "1px",
        },
    })
);

export interface NewDatasourceFormProps {
    onClose: () => void;
}

export const NewDatasourceForm: React.FC<NewDatasourceFormProps> = ({ onClose }) => {
    const classes = useStyles();
    const local = useDatasource([LocalDatasource.name, RestDatasource.name]);
    const datasources = [local, picsum];
    const [datasourceId, setDatasourceId] = useState(0);
    const datasourceConfig = datasources[datasourceId].config;
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
                value={datasourceId}
                ref={register}
                onChange={(e) => setDatasourceId(e.target.value as number)}
            >
                {datasources.map((d, i) => (
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
            <div className={classes.datasourceConfig}>
                <DialogContentText>Config:</DialogContentText>

                {Object.entries(datasourceConfig).map(([k, v]) => {
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

export const DatasourcePage: React.FC = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const pulse = usePulse();
    const local = useDatasource([LocalDatasource.name, RestDatasource.name]);
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = React.useState(false);

    useEffect(() => {
        (async () => {
            if (!loading) {
                setLoading(true);
                const collection = pulse.collection("index");
                const docs = await local.find();
                await collection.insert(docs);
            }
        })().catch((err) => console.error(err));
    }, []);

    const newDatasource = (e: React.FormEvent<HTMLFormElement>) => {
        console.log(e.target?.value);
        setOpenDialog(false);
    };

    return (
        <Box className={classes.root}>
            <List>
                <ListItem>
                    <ListItemText primary={local.name} />
                    <ListItemText primary={local.config.directory} />
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                </ListItem>
                <ListItem>
                    <ListItemText primary={picsum.name} />
                    <ListItemText primary={picsum.config.uri} />
                    <ListItemIcon>
                        <HttpIcon />
                    </ListItemIcon>
                </ListItem>
            </List>

            <div>
                <Button variant="outlined" color="primary" onClick={() => setOpenDialog(true)}>
                    Add Datasource
                </Button>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New Datasource</DialogTitle>

                    <DialogContent>
                        <NewDatasourceForm onClose={() => setOpenDialog(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </Box>
    );
};

export default DatasourcePage;

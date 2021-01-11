import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";
import React from "react";

const useStyles = makeStyles({
    root: {},
});

export interface ErrorProps extends PouchDB.Core.Error {}

export const PouchDBError: React.FC<ErrorProps> = (error?: ErrorProps) => {
    const classes = useStyles();
    return (
        <Alert severity="error" className={classes.root}>
            <AlertTitle>Error</AlertTitle>
            <strong>{error?.reason ?? "Failed to load document"}</strong>:{" "}
            {error?.message ?? "No information was provided"}
        </Alert>
    );
};

export default PouchDBError;

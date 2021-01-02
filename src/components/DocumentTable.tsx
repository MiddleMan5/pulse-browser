import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useAllDocs } from "use-pouchdb";
import { ArgumentTypes } from "../util";
import { CircularProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export interface DocumentRowProps {
    doc?: PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta>;
}

export const DocumentRow: React.FC<DocumentRowProps> = ({ doc }) => {
    if (doc == null) {
        return <TableRow />;
    }

    const docKeys = Object.entries(doc)
        .map(([k]) => k)
        .sort();

    return (
        <TableRow>
            {docKeys.map((k) => (
                <TableCell key={k} align="right">
                    {JSON.stringify((doc as any)[k])}
                </TableCell>
            ))}
        </TableRow>
    );
};

export interface DocumentTableProps {
    options: ArgumentTypes<typeof useAllDocs>[0];
}

export const DocumentTable: React.FC<DocumentTableProps> = ({ options }) => {
    const classes = useStyles();

    // Subscribe to database updates
    // TODO: Ignore indexes
    // TODO: Pagination
    const { rows, offset, total_rows, state, loading, error } = useAllDocs({ ...options, include_docs: true });
    const docKeys = rows?.flatMap((row) => Object.entries(row?.doc ?? {}).map(([k]) => k));
    const uniqueKeys = [...new Set(docKeys ?? [])].sort();
    const emptyDoc = Object.assign({}, ...uniqueKeys.map((k) => ({ [k]: undefined })));

    if (loading && rows.length === 0) {
        return <CircularProgress />;
    }

    if (state === "error" && error) {
        return (
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                <strong>{error?.message ?? "Failed to load documents"}</strong>:{" "}
                {error?.reason ?? "No information was provided"}
            </Alert>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {uniqueKeys.map((key) => (
                            <TableCell key={key} align="right">
                                {key}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        // Add undefined values for missing keys
                        const newDoc = Object.assign({}, emptyDoc, row?.doc ?? {});
                        return <DocumentRow key={row.id} doc={newDoc} />;
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { CircularProgress } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { AnyDocument, usePulse } from "../store/database";
import { useDoc } from "use-pouchdb";
import PouchDBError from "./PouchDBError";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    document: {},
});

export interface DocumentRowProps {
    id: PouchDB.Core.DocumentId;
    fields?: string[];
}

export const DocumentRow: React.FC<DocumentRowProps> = ({ id, fields }) => {
    const classes = useStyles();
    const { doc, loading, error } = useDoc(id);

    if (doc == null) {
        return <TableRow />;
    }
    if (loading) {
        return <CircularProgress />;
    }

    if (error != null) {
        return <PouchDBError {...error} />;
    }

    const docKeys = [...new Set([...Object.keys(doc), ...(fields ?? [])])].sort();

    return (
        <TableRow>
            {docKeys.map((k) => (
                <TableCell key={k} align="right" className={classes.document}>
                    {JSON.stringify((doc as any)[k] ?? "")}
                </TableCell>
            ))}
        </TableRow>
    );
};

export interface CollectionTableProps {
    name: string;
}

export const CollectionTable: React.FC<CollectionTableProps> = ({ name }) => {
    const classes = useStyles();
    const pulse = usePulse();
    const [error, setError] = useState<Error | any | undefined>();
    const [columns, setColumns] = useState<string[]>([]);
    const [documents, setDocuments] = useState<AnyDocument[]>([]);
    const [loading, setLoading] = useState(false);
    React.useEffect(() => {
        if (!loading) {
            setLoading(true);
            (async () => {
                const collection = pulse.collection(name);
                setColumns((await collection.fields()).sort());
                setDocuments(await collection.docs());
                setLoading(false);
            })()
                .catch((err) => setError(err))
                .finally(() => setLoading(false));
        }
    }, []);

    if (loading && columns.length === 0) {
        return <CircularProgress />;
    }

    if (error != null) {
        return <PouchDBError {...error} />;
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {columns.map((c) => (
                            <TableCell key={c} align="right">
                                {c}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documents.map((doc) => {
                        return <DocumentRow key={doc._id} id={doc._id} fields={columns} />;
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

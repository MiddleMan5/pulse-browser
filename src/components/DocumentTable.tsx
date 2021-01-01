import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { AnyDocument } from "../store/database";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export interface DocumentTableProps {
    documents: AnyDocument[];
}

export const DocumentTable: React.FC<DocumentTableProps> = ({ documents }) => {
    const classes = useStyles();
    // TODO: This is ugly
    const documentKeys = [...new Set(["_id", "_rev", ...documents.flatMap((doc) => Object.keys(doc))])];
    // TODO: Better way of enforcing document has _id property
    const rows = documents.map((doc) => {
        const { _id, _rev, ...content } = doc;
        return { _id, _rev, ...content };
    });

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {documentKeys.map((key) => (
                            <TableCell key={key} align="right">
                                {key}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        const { _id, _rev, ...content } = row;
                        return (
                            <TableRow key={_id}>
                                <TableCell key="_id" component="th" scope="row">
                                    {_id}
                                </TableCell>
                                <TableCell key="_rev" align="right">
                                    {_rev}
                                </TableCell>
                                {Object.entries(content ?? {}).map(([key, val]) => (
                                    <TableCell key={key} align="right">
                                        {JSON.stringify(val)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { ImageCardMenu } from "./ImageCardMenu";
import { ImageCardDialog } from "./ImageCardDialog";
import { CircularProgress } from "@material-ui/core";
import { PouchDBError } from "../PouchDBError";
import { useImage } from "../../models";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
        padding: 140,
    },
});

interface ImageCardProps {
    documentId: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ documentId }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [image, loading, error] = useImage(documentId);

    // TODO: Make loading/error same size as thumbnail
    // FIXME: This may cause infinite loading issues
    if (loading || image == null) {
        return <CircularProgress />;
    }

    if (error != null) {
        return <PouchDBError {...error} />;
    }

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={() => setOpen(true)}>
                <ImageCardMenu>
                    <CardMedia className={classes.media} image={image.thumbnail} title={image.name} />
                </ImageCardMenu>
            </CardActionArea>
            {open && <ImageCardDialog documentId={documentId} open={open} onClose={() => setOpen(false)} />}
        </Card>
    );
};

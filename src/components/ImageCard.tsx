import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { ImageCardMenu } from "./ImageCardMenu";
import { ImageCardDialog } from "./ImageCardDialog";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
        padding: 140,
    },
    // TODO: Something quirky is going on with the full size image size
    imageDialogContent: {
        maxWidth: "100%",
        maxHeight: "100%",
    }
});

interface ImageCardProps {
    // Path to image
    image: string;
    // FIXME: string | special react element thing IntrinsicAttributes
    title?: string;
    tags?: string[];
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, title, tags }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const showImageDialog = () => {
        setOpen(true);
    };

    const closeImageDialog = () => {
        setOpen(false);
    };

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={showImageDialog}>
                <ImageCardMenu>
                    <CardMedia className={classes.media} image={image} title={title ?? String(image)} />
                </ImageCardMenu>
            </CardActionArea>
            <ImageCardDialog title={title} open={open} onClose={closeImageDialog}>
                <img src={image} className={classes.imageDialogContent} />
            </ImageCardDialog>
        </Card>
    );
};

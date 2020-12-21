import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ImageCardMenu } from "./ImageCardMenu";

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
    // Path to image
    image: string;
    title?: string;
    tags?: string[];
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, title, tags }) => {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            
              <CardActionArea>
                <ImageCardMenu>
                  <CardMedia className={classes.media} image={image} title={title ?? String(image)} />
                </ImageCardMenu>
              </CardActionArea>          
        </Card>
    );
};

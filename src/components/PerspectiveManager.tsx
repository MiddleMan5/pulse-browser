import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import styles from "./SidePanels.css";

interface Props {
    classes: any;
    style: any;
}

class PerspectiveManager extends React.Component<Props> {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.panel} style={this.props.style}>
                <Typography className={classes.panelTitle}>Perspectives</Typography>
            </div>
        );
    }
    //         <Button onClick={() => history.push('/login')}>Login</Button>
}

export default withStyles(styles)(PerspectiveManager);

import React from "react";
import { DropTarget } from "react-dnd";
import { withStyles } from "@material-ui/core/styles/index";

const styles: any = () => ({
    dropzone: {
        margin: 5,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#1dd19f40",
        zIndex: 1,
        border: "3px dashed white",
        display: "flex",
    },
});

const boxTarget = {
    drop(props, monitor) {
        return props.onDrop(props, monitor);
    },
};

interface Props {
    classes?: any;
    canDrop: boolean;
    isOver: boolean;
    connectDropTarget: any;
    children: Object;
}

const TargetMoveFileBox = (props: Props) => {
    const { classes, canDrop, isOver, connectDropTarget, children } = props;
    const dragContent =
        canDrop && isOver ? <div className={classes.dropzone} /> /* {i18n.t('core:releaseToMoveDrop')} */ : undefined;
    return connectDropTarget(
        <div>
            {dragContent}
            {children}
        </div>
    );
};

export default withStyles(styles, { withTheme: true })(
    DropTarget(
        (props) => props.accepts,
        boxTarget,
        (connect, monitor) => ({
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    )(TargetMoveFileBox)
);

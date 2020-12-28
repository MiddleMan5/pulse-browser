import React from "react";
import { DropTarget } from "react-dnd";

const boxTarget = {
    drop(props, monitor) {
        return props.onDrop(props, monitor);
    },
};

interface Props {
    canDrop: boolean;
    isOver: boolean;
    connectDropTarget: any;
    className: string;
}

const TargetTableMoveFileBox = (props: Props) => {
    const { canDrop, isOver, connectDropTarget, ...restProps } = props;
    if (canDrop && isOver) {
        restProps.className += " dropzone"; // TODO set props.location type and add dropzonecopy based on this type
    }
    return connectDropTarget(<tr {...restProps} />);
};

export default DropTarget(
    (props) => props.accepts,
    boxTarget,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    })
)(TargetTableMoveFileBox);

import React from "react";
import { DropTarget } from "react-dnd";
import DragItemTypes from "./DragItemTypes";

interface Props {
    children: Array<Object>;
    canDrop: boolean;
    isOver: boolean;
    connectDropTarget: (param: Object) => void;
}

const boxTarget = {
    drop(props, monitor) {
        return {
            selectedEntries: props.selectedEntries,
            entryPath: props.entryPath,
        };
    },
};

const TagDropContainer = (props: Props) => {
    const { canDrop, isOver, connectDropTarget } = props;
    const isActive = canDrop && isOver;

    let border = "2px solid transparent";
    let backgroundColor = "transparent";
    if (isActive) {
        border = "2px solid #f7cf00";
        backgroundColor = "#f7cf00";
    } else if (canDrop) {
        border = "2px solid lightgray";
        backgroundColor = "lightgray";
    }

    return connectDropTarget(
        <div
            style={{
                border,
                backgroundColor,
                borderRadius: 5,
            }}
        >
            {props.children}
        </div>
    );
};

export default DropTarget(DragItemTypes.TAG, boxTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))(TagDropContainer);

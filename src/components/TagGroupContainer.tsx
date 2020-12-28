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
    drop(props) {
        return { tagGroupId: props.taggroup.uuid };
    },
};

const TagGroupContainer = (props: Props) => {
    const { canDrop, isOver, connectDropTarget } = props;
    const isActive = canDrop && isOver;

    let border = "2px solid transparent";
    let backgroundColor = "transparent";
    if (isActive) {
        border = "2px solid #f7cf00";
        backgroundColor = "#d9d9d9b5";
    } else if (canDrop) {
        // border = '2px solid gray';
        backgroundColor = "#d9d9d9b5";
    }

    return connectDropTarget(
        <div
            style={{
                margin: 0,
                padding: 0,
                paddingTop: 3,
                borderRadius: 5,
                minHeight: 20,
                border,
                backgroundColor,
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
}))(TagGroupContainer);

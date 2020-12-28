import React from "react";

interface Props {
    children: Object;
}

const TransparentBackground = (props: Props) => (
    <span
        style={{
            background:
                'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")',
        }}
    >
        {props.children}
    </span>
);

export default TransparentBackground;

import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

const initialState = {
  mouseX: null,
  mouseY: null,
};

interface ImageCardMenu { }


export function ImageCardMenu(props?: React.PropsWithChildren<ImageCardMenu>) {
  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
    setState(initialState);
  };

  return (
    <div onContextMenu={handleClick} style={{ cursor: 'context-menu' }}>
      {props?.children}
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleClose}>Save</MenuItem>
        <MenuItem onClick={handleClose}>Favorite</MenuItem>
        <MenuItem onClick={handleClose}>Details</MenuItem>
        <MenuItem onClick={handleClose}>Blacklist</MenuItem>
      </Menu>
    </div>
  );
}
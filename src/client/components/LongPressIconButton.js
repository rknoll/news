import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import longPress from '../helpers/longPress';

export default (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleOpen = (event) => {
    setMenuOpen(true);
    if (event) event.stopPropagation();
  };
  const handleClose = (event) => {
    setMenuOpen(false);
    if (event) event.stopPropagation();
  };
  const handleChange = (event) => {
    props.onClick(event.target.value);
    if (event) event.stopPropagation();
  };
  const handleLongPress = longPress(handleOpen);

  return (
    <IconButton color='inherit' onClick={() => props.onClick(null)} {...handleLongPress}>
      {props.icon}
      <Select open={menuOpen} onClose={handleClose} onOpen={handleOpen} onChange={handleChange}
              style={{width: 0, height: 0, visibility: 'hidden'}} value=''>
        {Object.entries(props.values).map(([key, value]) => <MenuItem key={key} value={key}>{value}</MenuItem>)}
      </Select>
    </IconButton>
  )
};

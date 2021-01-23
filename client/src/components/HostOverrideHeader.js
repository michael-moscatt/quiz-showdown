import React, { useState, useContext } from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import SettingsIcon from '@material-ui/icons/Settings';
import CardHeader from '@material-ui/core/CardHeader';
import { SocketContext } from '../socket-context';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing(1)
  }
}));

function HostOverrideHeader(props){
  const socket = useContext(SocketContext);
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  function changePoints(type){
    socket.emit('host-override', props.name, type);
    handleClose();
  }

  const handleClick = (event) => {
    if(anchorEl){
      setAnchorEl(null);
    } else{
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <CardHeader className={classes.root}
      title={props.name}
      action={
        <IconButton onClick={handleClick}>
          <SettingsIcon />
        </IconButton>
      }
      subheader={
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Tooltip title="Remove credit for last question">
            <IconButton onClick={() => changePoints('sub')}>
              <RemoveCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Give credit for last question">
            <IconButton onClick={() => changePoints('add')}>
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        </Popover>
      } />
    
  );
}
export default HostOverrideHeader;
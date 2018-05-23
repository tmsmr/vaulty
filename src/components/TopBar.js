import React from 'react';

import Actions from '../actions';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';

const TopBar = (props) => {
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="title" color="inherit" style={{flex: 1}}>
          Vaulty
        </Typography>
        <IconButton
          color="inherit"
          onClick={() => Actions.themeToggle(props.store)}
        >
          <Icon>invert_colors</Icon>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;

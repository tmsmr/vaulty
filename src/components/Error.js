import React from 'react';

import {withStyles} from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';

import Actions from '../actions';

const styles = {
  snackbar: {
    background: red[800]
  }
};

const Error = props => {
  return (
    <Snackbar
      SnackbarContentProps={{
        classes: {
          root: props.classes.snackbar
        }
      }}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      autoHideDuration={10000}
      onClose={() => Actions.errReset(props.store)}
      open={!!props.store.error}
      message={
        <Typography variant="subheading" color="inherit">
          {props.store.error}
        </Typography>
      }
    />
  );
};

export default withStyles(styles)(Error);

import React, { Component } from 'react';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

class Login extends Component {
  render() {
    return (
      <Grid container style={{height: "100%"}} justify="center" alignItems="center">
        <Grid item>
          <Paper style={{height: 200, width: 400}}></Paper>
        </Grid>
      </Grid>
    );
  }
}

export default Login;

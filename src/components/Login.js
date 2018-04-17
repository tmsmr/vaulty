import React, { Component } from 'react';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    return (
      <Grid container style={{height: "100%"}} justify="center" alignItems="center">
        <Grid item>
          <Paper style={{padding: 50}}>
            <Grid container direction="column">
              <Grid>
                <Typography variant="title">
                  Login
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="username"
                  label="Username"
                  value={this.state.username}
                  margin="normal"
                />
              </Grid>
              <Grid item>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  value={this.state.username}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default Login;

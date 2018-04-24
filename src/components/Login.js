import React, { Component } from 'react';

import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import Actions from '../actions';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  keypress(e) {
    if(e.key === "Enter") {
      this.login();
    }
  }
  
  login() {
    Actions.login(this.props.store, this.state.username, this.state.password);
  }

  render() {
    return (
      <Grid container style={{height: "100%"}} justify="center" alignItems="center">
        <Grid item>
          <Paper style={{padding: 50}}>
            <Grid container direction="column">
              <Grid item>
                <TextField
                  id="username"
                  label="Username"
                  margin="normal"
                  onChange={e => this.setState({username: e.target.value})}
                  onKeyPress={e => this.keypress(e)}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  margin="normal"
                  onChange={e => this.setState({password: e.target.value})}
                  onKeyPress={e => this.keypress(e)}
                />
              </Grid>
              <Grid item>
                <Button
                  style={{width: '100%', marginTop: 25}}
                  onClick={() => this.login()}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default Login;

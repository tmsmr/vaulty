import React, {Component} from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Actions from '../actions';

const AUTH_METHODS = [
  {name: 'userpass', display: 'User/Password'},
  {name: 'ldap', display: 'LDAP'}
];

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      authMethod: AUTH_METHODS[0]
    }
  }

  keypress(e) {
    if (e.key === "Enter") {
      this.login();
    }
  }

  login() {
    Actions.login(this.props.store, this.state.username, this.state.password);
  }

  componentDidMount() {
    Actions.autologin(this.props.store);
  }

  render() {
    return (
      <Grid container style={{height: "100%"}} justify="center" alignItems="center">
        <Grid item>
          <Paper style={{padding: 40}}>
            <Grid container direction="column">
              <Grid item>
                <Select
                  style={{width: '100%'}}
                  value={this.state.authMethod.name}
                  onChange={e => {
                    this.setState({authMethod: AUTH_METHODS.find(method => method.name === e.target.value)})
                  }}
                >
                  {AUTH_METHODS.map(method => {
                    return (<MenuItem value={method.name} key={method.name}>{method.display}</MenuItem>);
                  })};
                </Select>
              </Grid>
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
                  style={{width: '100%', marginTop: 30}}
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

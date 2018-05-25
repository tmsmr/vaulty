import React, {Component} from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Actions from '../actions';

const AUTH_METHODS = [
  {name: 'userpass', display: 'User/Password', loginFunc: (store, username, password) => Actions.loginUserPass(store, username, password)},
  {name: 'ldap', display: 'LDAP', loginFunc: (store, username, password) => Actions.loginLDAP(store, username, password)}
];

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      authMethod: AUTH_METHODS.find(method => method.name === this.props.store.authMethod),
      endpoint: this.props.store.endpoint,
      mount:this.props.store.mount
    }
  }

  keypress(e) {
    if (e.key === "Enter") {
      this.login();
    }
  }

  login() {
    this.state.authMethod.loginFunc(this.props.store, this.state.username, this.state.password);
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
                    this.setState({authMethod: AUTH_METHODS.find(method => method.name === e.target.value)});
                    Actions.setAuthMethod(this.props.store, e.target.value);
                  }}
                >
                  {AUTH_METHODS.map(method => {
                    return (<MenuItem value={method.name} key={method.name}>{method.display}</MenuItem>);
                  })};
                </Select>
              </Grid>
              <Grid item>
                <TextField
                  id="endpoint"
                  label="Vault endpoint"
                  margin="normal"
                  value={this.state.endpoint}
                  onChange={e => {
                    this.setState({endpoint: e.target.value});
                    Actions.setVaultEndpoint(this.props.store, e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="mount"
                  label="Vault mount"
                  margin="normal"
                  value={this.state.mount}
                  onChange={e => {
                    this.setState({mount: e.target.value});
                    Actions.setVaultMount(this.props.store, e.target.value);
                  }}
                />
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

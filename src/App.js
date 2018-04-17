import React, { Component } from 'react';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';

import Store from './store.js';
import Routes from './routes.js';

import TopBar from './components/TopBar.js';

const lightTheme = createMuiTheme();
const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      store: new Store()
    };
    this.state.store.subscribe(s => {
      this.setState({ store: s });
    });
    this.state.store.subscribe( s => {
      console.log(s);
    });
  }

  render() {
    const theme = this.state.store.darkTheme ? darkTheme : lightTheme;
    const Comp = Routes[this.state.store.component];

    return (
      <MuiThemeProvider theme={theme}>
        <TopBar store={this.state.store} />
        <div style={{width: '100%', marginTop: this.props.width === 'xs' ? 48 + 20 : 64 + 20, marginBottom: 20}}>
          <Comp store={this.state.store} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withWidth()(App);

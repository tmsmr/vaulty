import React, {Component} from 'react';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';

import Store from './store';
import Routes from './routes';

import TopBar from './components/TopBar';
import Error from './components/Error';

import Actions from './actions';

const lightTheme = createMuiTheme();
const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#232323'
    },
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
      this.setState({store: s});
    });
    /*this.state.store.subscribe(s => {
      console.log(s);
    });*/
  }

  componentDidMount() {
    Actions.loadPreferences(this.state.store);
  }

  render() {
    const theme = this.state.store.darkTheme ? darkTheme : lightTheme;
    const bgColor = this.state.store.darkTheme ? '#303030' : '#f3f3f3';
    const Comp = Routes[this.state.store.component];

    return (
      <MuiThemeProvider theme={theme}>
        <div style={{width: '100%', minHeight: '100%', display: 'flex', backgroundColor: bgColor}}>
          <TopBar store={this.state.store}/>
          <Error store={this.state.store}/>
          <div style={{width: '100%', marginTop: this.props.width === 'xs' ? 48 + 20 : 64 + 20, marginBottom: 20}}>
            <Comp store={this.state.store}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withWidth()(App);

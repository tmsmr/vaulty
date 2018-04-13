import React, { Component } from 'react';

import Store from './store.js';
import Routes from './routes.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      store: new Store()
    };
    this.state.store.subscribe(s => {
      this.setState({ store: s });
    });
  }

  render() {
    const Comp = Routes[this.state.store.component];

    return (
      <div>
        <Comp store={this.state.store} />
      </div>
    );
  }
}

export default App;

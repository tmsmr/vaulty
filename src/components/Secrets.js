import React, {Component} from 'react';

import Actions from '../actions.js';

class Secrets extends Component {
  componentDidMount() {
    Actions.loadSecrets(this.props.store, "/")
  }

  render() {
    if(!this.props.store.secrets) return null;
    return (
      <div>
        {this.props.store.secrets.map(function(a) {
          if(a.folder) {
            return (
              <p key={a.item}>{a.item}</p>
            );
          }
          return (
            <p key={a.item}>{a.item}: {a.value}</p>
          );
        })}
      </div>
    );
  }
}

export default Secrets;

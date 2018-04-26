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
          if(a.type === "folder") {
            return (
              <p>{a.item}</p>
            );
          }
          return (
            <p>{a.item}: {a.secret}</p>
          );
        })}
      </div>
    );
  }
}

export default Secrets;

import React, {Component} from 'react';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Table, {TableBody} from 'material-ui/Table';
import Chip from 'material-ui/Chip';

import FolderRow from './FolderRow.js';
import SecretRow from './SecretRow.js';

import Actions from '../actions.js';

class Secrets extends Component {
  componentDidMount() {
    Actions.loadSecrets(this.props.store, "/");
  }

  render() {
    if (!this.props.store.secrets) {
      return (
        <Paper style={{
          marginLeft: 10,
          marginRight: 10,
          padding: 20,
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Typography style={{textAlign: "center"}}>No content</Typography>
        </Paper>
      );
    }

    return (
      <div>
        <div style={{marginLeft: 15, marginRight: 15}}>
          {this.props.store.path.map((component, i) => {
            return (<Chip key={i} label={component} style={{marginRight: 10, marginBottom: 5}} onClick={() => {
              Actions.loadSecrets(this.props.store, this.props.store.path.slice(0,i + 1).join(""));
            }
            }/>);
          })}
        </div>
        <Paper style={{marginTop: 10, marginLeft: 15, marginRight: 15, overflowX: 'auto'}}>
          <Table>
            <TableBody>
              {this.props.store.secrets.map(entry => {
                if (entry.folder)
                  return (<FolderRow key={entry.item} folder={entry} store={this.props.store}/>);
                return (<SecretRow key={entry.item} secret={entry} store={this.props.store}/>);
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default Secrets;

import React, {Component} from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Table, TableBody} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

import FolderRow from './FolderRow';
import SecretRow from './SecretRow';
import NewSecretDialog from './NewSecretDialog';

import Actions from '../actions';

const tableContentWrapStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center"
};

class Secrets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newSecretDialogVisible: false
    };
  }

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
              Actions.loadSecrets(this.props.store, this.props.store.path.slice(0, i + 1).join(""));
            }
            }/>);
          })}
          <Chip key={"+"} label={"+"} style={{marginRight: 10, marginBottom: 5}}
                onClick={() => this.setState({newSecretDialogVisible: true})}/>
        </div>
        {this.state.newSecretDialogVisible &&
        <NewSecretDialog path={this.props.store.path.join("")}
                         onCancel={() => this.setState({newSecretDialogVisible: false})}
                         onCreate={(path, value) => {
                           Actions.addSecret(this.props.store, path, value);
                           this.setState({newSecretDialogVisible: false});
                         }}
        />
        }
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
export {tableContentWrapStyle};

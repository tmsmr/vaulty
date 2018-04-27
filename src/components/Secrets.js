import React, {Component} from 'react';

import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Table, {TableBody, TableCell, TableRow} from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import grey from 'material-ui/colors/grey';

import Actions from '../actions.js';

class Secrets extends Component {
  componentDidMount() {
    Actions.loadSecrets(this.props.store, "/customers/megacompany/");
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

    const folderRowStyle = {
      backgroundColor: this.props.store.darkTheme ? grey[700] : grey[100]
    };

    const secretRowStyle = {
      backgroundColor: this.props.store.darkTheme ? grey[800] : grey[0]
    };

    return (
      <Paper style={{marginLeft: 10, marginRight: 10, overflowX: 'auto'}}>
        <Table>
          <TableBody>
            {this.props.store.secrets.map(entry => {
              const icon = entry.folder ? "folder" : "vpn_key";
              return (
                <TableRow key={entry.item} style={entry.folder ? folderRowStyle : secretRowStyle}>
                  <TableCell>
                    <div style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}>
                      <Icon color="disabled" style={{marginRight: 10}}>{icon}</Icon>
                      <Typography variant="body2">{entry.item}</Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center"
                    }}>
                      <Typography>{entry.value}</Typography>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default Secrets;

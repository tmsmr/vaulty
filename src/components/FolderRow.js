import React, {Component} from 'react';

import Typography from 'material-ui/Typography';
import {TableCell, TableRow} from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import grey from 'material-ui/colors/grey';

import Actions from '../actions.js';

const contentWrapStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center"
};

class FolderRow extends Component {
  render() {
    return (
      <TableRow
        style={{backgroundColor: this.props.store.darkTheme ? grey[700] : grey[100]}}
        onClick={() => {
          this.props.store.path.push(this.props.folder.item);
          Actions.loadSecrets(this.props.store, this.props.store.path.join("/"));
        }}>
        <TableCell>
          <div style={contentWrapStyle}>
            <Icon color="disabled" style={{marginRight: 10}}>folder</Icon>
            <Typography variant="body2">{this.props.folder.item}</Typography>
          </div>
        </TableCell>
        <TableCell>
          <div style={contentWrapStyle}/>
        </TableCell>
      </TableRow>
    );
  }
}

export default FolderRow;
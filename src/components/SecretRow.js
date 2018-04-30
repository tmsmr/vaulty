import React, {Component} from 'react';

import Typography from 'material-ui/Typography';
import {TableCell, TableRow} from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import grey from 'material-ui/colors/grey';

const contentWrapStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center"
};

class SecretRow extends Component {
  render() {
    return (
      <TableRow
        style={{backgroundColor: this.props.store.darkTheme ? grey[800] : grey[0]}}>
        <TableCell>
          <div style={contentWrapStyle}>
            <Icon color="disabled" style={{marginRight: 10}}>vpn_key</Icon>
            <Typography variant="body2">{this.props.secret.item}</Typography>
          </div>
        </TableCell>
        <TableCell>
          <div style={contentWrapStyle}>
            <Typography>{this.props.secret.value}</Typography>
          </div>
        </TableCell>
      </TableRow>
    );
  }
}

export default SecretRow;

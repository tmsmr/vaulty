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

const backgroundColors = {
  light: {normal: grey[200], hover: grey[300]},
  dark: {normal: grey[700], hover: grey[600]}
};

class FolderRow extends Component {
  constructor(props) {
    super(props);
    this.state = {hovering: false};
  }

  render() {
    console.log(this.state);
    let bg = this.state.hovering ? (this.props.store.darkTheme ? backgroundColors.dark.hover : backgroundColors.light.hover) : (this.props.store.darkTheme ? backgroundColors.dark.normal : backgroundColors.light.normal);
    return (
      <TableRow
        style={{backgroundColor: bg, cursor: "pointer"}}
        onMouseEnter={() => this.setState({hovering: true})}
        onMouseLeave={() => this.setState({hovering: false})}
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
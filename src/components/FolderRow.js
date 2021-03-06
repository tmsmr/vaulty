import React, {Component} from 'react';

import Typography from '@material-ui/core/Typography';
import {TableCell, TableRow} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import grey from '@material-ui/core/colors/grey';

import Actions from '../actions';

import {tableContentWrapStyle} from './Secrets';

const backgroundColors = {
  light: {normal: 'white', hover: grey[300]},
  dark: {normal: grey[800], hover: grey[700]}
};

class FolderRow extends Component {
  constructor(props) {
    super(props);
    this.state = {hovering: false};
  }

  render() {
    let bg = this.state.hovering ? (this.props.store.darkTheme ? backgroundColors.dark.hover : backgroundColors.light.hover) : (this.props.store.darkTheme ? backgroundColors.dark.normal : backgroundColors.light.normal);
    return (
      <TableRow
        style={{backgroundColor: bg, cursor: "pointer"}}
        onMouseOver={() => this.setState({hovering: true})}
        onMouseEnter={() => this.setState({hovering: true})}
        onMouseLeave={() => this.setState({hovering: false})}
        onClick={() => {
          Actions.loadSecrets(this.props.store, this.props.store.path.join("") + this.props.folder.item);
        }}>
        <TableCell>
          <div style={tableContentWrapStyle}>
            <Icon color="disabled" style={{marginRight: 10}}>folder</Icon>
            <Typography variant="body2">{this.props.folder.item}</Typography>
          </div>
        </TableCell>
        <TableCell>
          <div style={tableContentWrapStyle}/>
        </TableCell>
      </TableRow>
    );
  }
}

export default FolderRow;
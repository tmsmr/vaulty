import React, {Component} from 'react';

import Typography from 'material-ui/Typography';
import {TableCell, TableRow} from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import grey from 'material-ui/colors/grey';

const contentWrapStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center"
};

const TYPES = {
  PLAIN: 0,
  PASSWORD: 1,
  USERNAME: 2,
  HREF: 3
};

class SecretRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passVisible: false
    };
  }

  guessType() {
    if (this.props.secret.item.toLowerCase().includes("password")) return TYPES.PASSWORD;
    if (this.props.secret.item.toLowerCase().includes("username")) return TYPES.USERNAME;
    if (this.props.secret.value) {
      if (this.props.secret.value.toLowerCase().startsWith("http://")) return TYPES.HREF;
    }
    return TYPES.PLAIN;
  }

  render() {
    let type = this.guessType();
    let leftIcon = null;
    switch (type) {
      case TYPES.USERNAME:
        leftIcon = "person";
        break;
      case TYPES.PASSWORD:
        leftIcon = "vpn_key";
        break;
      case TYPES.HREF:
        leftIcon = "public";
        break;
      default:
        break;
    }
    return (
      <TableRow
        style={{backgroundColor: this.props.store.darkTheme ? grey[800] : grey[0]}}>
        <TableCell>
          <div style={contentWrapStyle}>
            {leftIcon &&
            <Icon color="disabled" style={{marginRight: 10}}>{leftIcon}</Icon>
            }
            <Typography variant="body2">{this.props.secret.item}</Typography>
          </div>
        </TableCell>
        {this.props.secret.value &&
        <TableCell>
          <div style={contentWrapStyle}>
            <Input
              autoComplete="off"
              id={this.props.secret.item}
              fullWidth
              type={(type === TYPES.PASSWORD && !this.state.passVisible) ? "password" : "text"}
              value={this.props.secret.value}
            />
            {type === TYPES.HREF &&
            <a href={this.props.secret.value} target="_blank" style={{color: "inherit", textDecoration: "none"}}>
              <IconButton color="inherit">
                <Icon>link</Icon>
              </IconButton>
            </a>
            }
            {type === TYPES.PASSWORD &&
            <IconButton color="inherit"
                        onClick={() => this.setState({passVisible: !this.state.passVisible})}>
              <Icon>{this.state.passVisible ? "visibility_off" : "visibility"}</Icon>
            </IconButton>
            }
            <IconButton color="inherit" onClick={() => {
              document.querySelector("#" + this.props.secret.item).select();
              document.execCommand("copy");
            }}>
              <Icon>content_copy</Icon>
            </IconButton>
          </div>
        </TableCell>
        }
      </TableRow>
    );
  }
}

export default SecretRow;

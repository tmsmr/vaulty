import React, {Component} from 'react';

import Typography from 'material-ui/Typography';
import {TableCell, TableRow} from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import grey from 'material-ui/colors/grey';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import Actions from '../actions.js';

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
      passVisible: false,
      delDialogVisible: false,
      value: null,
      modified: false
    };
  }

  componentDidUpdate() {
    if (this.state.value == null && this.props.secret.value) {
      this.setState({value: this.props.secret.value})
    }
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
        <TableCell>
          {this.state.value != null &&
          <div style={contentWrapStyle}>
            {this.state.modified &&
            <IconButton color="inherit">
              <Icon>save</Icon>
            </IconButton>
            }
            <Input
              autoComplete="off"
              id={this.props.secret.item}
              fullWidth
              type={(type === TYPES.PASSWORD && !this.state.passVisible) ? "password" : "text"}
              value={this.state.value}
              onChange={e => {
                this.setState({value: e.target.value});
                this.setState({modified: true});
              }}
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
            <IconButton color="inherit" onClick={() => {
              this.setState({delDialogVisible: true});
            }}>
              <Icon>delete</Icon>
            </IconButton>
            <div>
              <Dialog
                open={this.state.delDialogVisible}
                onClose={() => this.setState({delDialogVisible: false})}
              >
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                  <DialogContentText>{"Permanently delete secret " + this.props.store.path.join("") + this.props.secret.item + "?"}</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => this.setState({delDialogVisible: false})}>
                    Cancel
                  </Button>
                  <Button color="secondary" onClick={() => {
                    Actions.deleteSecret(this.props.store, this.props.store.path.join("") + this.props.secret.item, this.props.secret);
                    this.setState({delDialogVisible: false});
                  }}>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
          }
        </TableCell>
      </TableRow>
    );
  }
}

export default SecretRow;

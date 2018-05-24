import React, {Component} from 'react';

import Typography from 'material-ui/Typography';
import {TableCell, TableRow} from 'material-ui/Table';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import grey from 'material-ui/colors/grey';

import Actions from '../actions';

import {tableContentWrapStyle} from './Secrets';
import ConfirmationDialog from './ConfirmationDialog';

const SECRET_TYPES = {
  PLAIN: {leftIcon: null},
  PASSWORD: {leftIcon: "vpn_key"},
  USERNAME: {leftIcon: "person"},
  HREF: {leftIcon: "public"}
};

function guessSecretType(item, value) {
  if (item.toLowerCase().includes("password") || item.toLowerCase().includes("passwort")) return SECRET_TYPES.PASSWORD;
  if (item.toLowerCase().includes("username") || item.toLowerCase().includes("benutzername")) return SECRET_TYPES.USERNAME;
  if (value) {
    if (value.toLowerCase().startsWith("http://")) return SECRET_TYPES.HREF;
  }
  return SECRET_TYPES.PLAIN;
}

class SecretRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passVisible: false,
      delDialogVisible: false,
      inputValue: null,
      inputValueModified: false
    };
  }

  componentDidUpdate() {
    if (this.state.inputValue == null && this.props.secret.value != null) {
      this.setState({inputValue: this.props.secret.value});
    }
  }

  render() {
    let type = guessSecretType(this.props.secret.item, this.state.inputValue);
    return (
      <TableRow style={{backgroundColor: this.props.store.darkTheme ? grey[800] : grey[0]}}>
        <TableCell>
          <div style={tableContentWrapStyle}>
            {type.leftIcon &&
            <Icon color="disabled" style={{marginRight: 10}}>{type.leftIcon}</Icon>
            }
            <Typography variant="body2">{this.props.secret.item}</Typography>
          </div>
        </TableCell>
        <TableCell>
          {this.state.inputValue != null &&
          <div style={tableContentWrapStyle}>
            {this.state.inputValueModified &&
            <IconButton color="inherit"
                        onClick={() => {
                          Actions.updateSecret(this.props.store, this.props.store.path.join("") + this.props.secret.item, this.props.secret, this.state.inputValue)
                            .then(() => this.setState({inputValueModified: false}));
                        }}>
              <Icon>save</Icon>
            </IconButton>
            }
            <Input
              autoComplete="off"
              id={this.props.secret.item}
              fullWidth
              type={(type === SECRET_TYPES.PASSWORD && !this.state.passVisible) ? "password" : "text"}
              value={this.state.inputValue}
              onChange={e => {
                this.setState({inputValue: e.target.value});
                if (e.target.value === this.props.secret.value) this.setState({inputValueModified: false});
                else this.setState({inputValueModified: true});
              }}
            />
            {type === SECRET_TYPES.HREF &&
            <a href={this.state.inputValue} target="_blank" style={{color: "inherit", textDecoration: "none"}}>
              <IconButton color="inherit">
                <Icon>link</Icon>
              </IconButton>
            </a>
            }
            {type === SECRET_TYPES.PASSWORD &&
            <IconButton color="inherit" onClick={() => this.setState({passVisible: !this.state.passVisible})}>
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
          </div>
          }
        </TableCell>
        <ConfirmationDialog open={this.state.delDialogVisible}
                            message={"Permanently delete secret " + this.props.store.path.join("") + this.props.secret.item + "?"}
                            confirmColor={"secondary"}
                            onCancel={() => this.setState({delDialogVisible: false})}
                            onConfirm={() => {
                              Actions.deleteSecret(this.props.store, this.props.store.path.join("") + this.props.secret.item, this.props.secret);
                              this.setState({delDialogVisible: false});
                            }}
        />
      </TableRow>
    );
  }
}

export default SecretRow;

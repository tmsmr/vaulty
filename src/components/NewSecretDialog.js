import React, {Component} from 'react';

import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions
} from 'material-ui/Dialog';

class NewSecretDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: props.path,
      value: ""
    };
  }

  render() {
    return (
      <Dialog open>
        <DialogTitle>Create new Secret</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="path"
            label="Path"
            fullWidth
            value={this.state.path}
            onChange={e => this.setState({path: e.target.value})}
          />
          <TextField
            id="value"
            label="Value"
            fullWidth
            style={{marginTop: 15}}
            value={this.state.value}
            onChange={e => this.setState({value: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel}>
            Cancel
          </Button>
          <Button onClick={() => this.props.onCreate(this.state.path, this.state.value)}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default NewSecretDialog;

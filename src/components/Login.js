import React, { Component } from 'react';

import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

class Login extends Component {
  render() {
    return (
      <Card style={{marginTop: 75}}>
        <CardContent>
          <Typography variant="title">
            Login
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default Login;

import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import "../scss/login.scss";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { API_HOST, API_LOGIN } from '../../util/api-routes';
import { withSnackbar, WithSnackbarProps } from 'notistack';

@observer
class LoginComponent extends React.Component<WithSnackbarProps> {
  @observable private username: string = "";
  @observable private password: string = "";

  private async apiLogIn(): Promise<void> {
    const response = await fetch(`${API_HOST}${API_LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    });
    const tokenPayload = await response.json();
    if(tokenPayload.failed) {
      // We have encountered an error, duh!
      console.error(tokenPayload);
      this.props.enqueueSnackbar(tokenPayload.reason, {
        variant: "error"
      });
      return;
    } 

    localStorage.setItem('jwtKey', tokenPayload.token);
    // same reason as register.tsx, hard-reload
    window.location.pathname = "/";
  }

  public render() {
    return (
      <section className="login">
        <section className="form-container">
          <Typography variant="h4">Login</Typography>
          <Typography variant="subtitle2">
            If you don't have one yet, <Link to="/register">create one now</Link>!
          </Typography>
          <section className="form">
            <TextField margin="normal"
              variant="filled"
              label="username"
              placeholder="johndoe1337"
              onChange={ev => this.username = ev.target.value}
              value={this.username}
              fullWidth />
            <br />
            <TextField
              type="password"
              margin="normal"
              variant="filled"
              label="password"
              placeholder="supersecret pass"
              value={this.password}
              onChange={ev => this.password = ev.target.value}
              fullWidth />
            <br />
            <br />
            <Button variant="contained" color="secondary" size="medium" onClick={() => this.apiLogIn()}>
              Login
            </Button>
          </section>
        </section>
      </section>
    )
  }
}

export const Login = withSnackbar(LoginComponent);
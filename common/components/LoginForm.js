import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import {clickedLogin} from '../actions/auth-actions'

import { connect } from 'react-redux'

const styles = {
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  
}

class LoginForm extends React.Component {
  state = {
    username: '',
    password: '',
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  submit(e) {
    const { onLogin } = this.props
    e.preventDefault()
    onLogin(this.state.username, this.state.password)
  }

  keypress(e) {
    if (e.key === 'Enter') { 
      const { onLogin } = this.props
      e.preventDefault()
      onLogin(this.state.username, this.state.password)
    }
  }

  render() {
    const { classes } = this.props
    return (
      <form className={classes.container} noValidate autoComplete="off"
        onKeyPress={(event) => this.keypress(event)}>
        <Typography type="display2" style={{color:'black'}} gutterBottom>
          Login
        </Typography>
        <TextField
          id="name"
          label="Username"
          className={classes.textField}
          value={this.state.username}
          margin="normal"
          onChange = {this.handleChange('username')}/>
        <br/>
        <TextField
          id="password"
          label="Password"
          className={classes.textField}
          value={this.state.password}
          type="password"
          margin="normal"
          onChange = {this.handleChange('password')}/>
        <br/>
        <Button raised color="primary" onClick={(event) => this.submit(event)}>
          Submit
        </Button>
      </form>
    )
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user : state.user
    }),
  dispatch =>
    ({
      onLogin(username, password) {
        dispatch(
          clickedLogin(username,password))
      }
    }))(withStyles(styles)(LoginForm))



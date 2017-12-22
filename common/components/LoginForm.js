import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
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
  field: {
    textAlign: 'center',
  }
}

class LoginForm extends React.Component {
  state = {
    username: '',
    password: '',
    fireRedirect:false
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  localLogin(e)
  {
    const { onLogin } = this.props
    this.setState({fireRedirect: true})
    e.preventDefault()
    onLogin(this.state.username, this.state.password)
  }

  submit(e) {
    this.localLogin(e)
  }

  keypress(e) {
    if (e.key === 'Enter') { 
      this.localLogin(e)
    }
  }
  render() {
    if(this.state.fireRedirect && this.props.user.loggedIn === true){
      Router.push('/')
      return(<div></div>)
    }
    else{
      const { classes } = this.props
      return (
        <form className={classes.container} noValidate autoComplete="off"
          onKeyPress={(event) => this.keypress(event)}>
          <Typography type="display2" style={{color:'black'}} gutterBottom>
            Login
          </Typography>
          <TextField
            id="name"
            error={typeof this.props.user.error.login_username !== 'undefined'}
            className={classes.field}
            helperText = {this.props.user.error.login_username}
            label="Username"
            className={classes.textField}
            value={this.state.username}
            margin="normal"
            onChange = {this.handleChange('username')}/>
          <br/>
          <TextField
            error={typeof this.props.user.error.login_password !== 'undefined'}
            id="password"
            label="Password"
            helperText = {this.props.user.error.login_password}
            className={classes.field}
            value={this.state.password}
            type="password"
            margin="normal"
            onChange = {this.handleChange('password')}/>
          <br/>
          <br/>
          <Typography type="subheading" style={{color:'black'}} gutterBottom>
          Don't have an account? <Link href="/signup"><a>Signup.</a></Link>
          </Typography>
          <br/>
          <Button raised color="accent" onClick={(event) => this.submit(event)}>
            Submit
          </Button>
        </form>
      )
    }
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



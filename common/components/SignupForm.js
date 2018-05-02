import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import {clickedSignup} from '../actions/auth-actions'

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

class SignupForm extends React.Component {
  state = {
    username:'',
    password:'',
    first_name:'',
    last_name:'',
    email:'',
    fireRedirect:false
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  mySignup(e)
  {
    const { onSignup } = this.props
    this.setState({fireRedirect: true})
    e.preventDefault()
    onSignup(this.state.username,
      this.state.first_name,
      this.state.last_name,
      this.state.email, 
      this.state.password)
  }

  submit(e) {
    this.mySignup(e)
  }

  keypress(e) {
    if (e.key === 'Enter') { 
      this.mySignup(e)
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
          <Typography variant="display2" style={{color:'black'}} gutterBottom>
            Signup
          </Typography>
          <TextField
            id="name"
            error={typeof this.props.user.error.signup_username !== 'undefined'}
            className={classes.field}
            helperText = {this.props.user.error.signup_username}
            label="Enter A Username"
            className={classes.textField}
            value={this.state.username}
            margin="normal"
            onChange = {this.handleChange('username')}/>
          <br/>
          <TextField
            error={typeof this.props.user.error.signup_password !== 'undefined'}
            id="password"
            label="Enter A Password"
            helperText = {this.props.user.error.signup_password}
            className={classes.field}
            value={this.state.password}
            type="password"
            margin="normal"
            onChange = {this.handleChange('password')}/>
          <br/>
          <TextField
            id="first"
            label="Enter your First Name"
            className={classes.textField}
            value={this.state.first_name}
            margin="normal"
            onChange = {this.handleChange('first_name')}/>
          <br/>
          <TextField
            id="last"
            label="Enter your Last Name"
            className={classes.textField}
            value={this.state.last_name}
            margin="normal"
            onChange = {this.handleChange('last_name')}/>
          <br/>
          <TextField
            error={typeof this.props.user.error.signup_email !== 'undefined'}
            id="email"
            label="Enter your Email"
            helperText = {this.props.user.error.signup_email}
            className={classes.textField}
            value={this.state.email}
            margin="normal"
            onChange = {this.handleChange('email')}/>
          <br/>
          <br/>
          <Typography variant="subheading" style={{color:'black'}} gutterBottom>
          Already have an account? <Link href="/login"><a>Login.</a></Link>
          </Typography>
          <br/>
          <Button raised color="accent" onClick={(event) => this.submit(event)}>
            Sign Up!
          </Button>
        </form>
      )
    }
  }
}

SignupForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user : state.user
    }),
  dispatch =>
    ({
      onSignup(username,
        first_name,
        last_name,
        email, 
        password) {
        dispatch(
          clickedSignup(username,
            first_name,
            last_name,
            email, 
            password))
      }
    }))(withStyles(styles)(SignupForm))



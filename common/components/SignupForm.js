import React from 'react'
import Link from 'next/link'
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
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  submit(e) {
    const { onSignup } = this.props
    e.preventDefault()
    onSignup(this.state.username,
      this.state.first_name,
      this.state.last_name,
      this.state.email, 
      this.state.password)
  }

  keypress(e) {
    if (e.key === 'Enter') { 
      const { onSignup } = this.props
      e.preventDefault()
      onSignup(this.state.username,
        this.state.first_name,
        this.state.last_name,
        this.state.email, 
        this.state.password)
    }
  }

  render() {
    const { classes } = this.props
    return (
      <form className={classes.container} noValidate autoComplete="off"
        onKeyPress={(event) => this.keypress(event)}>
        <Typography type="display2" style={{color:'black'}} gutterBottom>
          Signup
        </Typography>
        <TextField
          id="name"
          className={classes.field}
          label="Enter a Username"
          className={classes.textField}
          value={this.state.username}
          margin="normal"
          onChange = {this.handleChange('username')}/>
        <br/>
        <TextField
          id="password"
          label="Enter a Password"
          className={classes.textField}
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
          type="password"
          margin="normal"
          onChange = {this.handleChange('first_name')}/>
        <br/>
        <TextField
          id="last"
          label="Enter your Last Name"
          className={classes.textField}
          value={this.state.last_name}
          type="password"
          margin="normal"
          onChange = {this.handleChange('last_name')}/>
        <br/>
        <TextField
          id="email"
          label="Enter your Email"
          className={classes.textField}
          value={this.state.email}
          type="password"
          margin="normal"
          onChange = {this.handleChange('email')}/>
        <br/>
        <br/>
        <Typography type="subheading" style={{color:'black'}} gutterBottom>
        Already have an account? <Link href="/login"><a>Login.</a></Link>
        </Typography>
        <br/>
        <Button raised color="primary" onClick={(event) => this.submit(event)}>
          Sign Up!
        </Button>
      </form>
    )
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



import React from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import DerbyTextField from './DerbyTextField'
import {clickedCreatePassword} from '../actions/auth-actions'

import { connect } from 'react-redux'

const styles = theme => ({
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
  },
  button : {
    backgroundColor: theme.palette.secondary.A700,
    color: theme.palette.secondary.A100,
  }
})

class CreatePasswordForm extends React.Component {
  state = {
    username: '',
    password: '',
    newPassword: '',
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  myForgot(e)
  {
    const { onCreatePassword } = this.props
    this.setState({fireRedirect: true})
    e.preventDefault()
    onCreatePassword(this.state.username, this.state.password, this.state.newPassword)
  }

  submit(e) {
    this.myForgot(e)
  }

  keypress(e) {
    if (e.key === 'Enter') { 
      this.myForgot(e)
    }
  }
  render() {
    if(this.state.fireRedirect && this.props.user.error.success1 === true){
      if (typeof document !== 'undefined'){
        Router.push('/login')
      }
      return(<div></div>)
    }
    else{
      const { classes } = this.props
      return (
        <form className={classes.container} noValidate autoComplete="off"
          onKeyPress={(event) => this.keypress(event)}>
          <Typography variant="display2" style={{color:'black'}} gutterBottom>
            Create New Password
          </Typography>
          <Typography variant="subheading" className={classes.text} gutterBottom>
            Some other text
          </Typography>
          <DerbyTextField
            errorText={this.props.user.error.create_password_username}
            label="Enter your username"
            value={this.state.username}
            onChange = {this.handleChange('username')}
          />
          <br/>
          <DerbyTextField
            errorText={this.props.user.error.create_password_password}
            label="Enter your temporary password"
            value={this.state.password}
            onChange = {this.handleChange('password')}
          />
          <br/>
          <DerbyTextField
            errorText={this.props.user.error.forgot_password_newpassword}
            label="Enter your new password"
            value={this.state.newPassword}
            type='password'
            onChange = {this.handleChange('newPassword')}
          />
          <br/>
          <br/>
          <Button raised className={classes.button} onClick={(event) => this.submit(event)}>
            Submit
          </Button>
        </form>
      )
    }
  }
}

CreatePasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user : state.user
    }),
  dispatch =>
    ({
      onCreatePassword(username,password,newPassword) {
        dispatch(
          clickedCreatePassword(username,password,newPassword))
      }
    }))(withStyles(styles)(CreatePasswordForm))



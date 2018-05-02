import React from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import DerbyTextField from './DerbyTextField'
import {clickedForgotPassword} from '../actions/auth-actions'

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

class ForgotPasswordForm extends React.Component {
  state = {
    email: ''
  }

  handleChange = () => event => {
    this.setState({
      email: event.target.value,
    })
  }

  myForgot(e)
  {
    const { onForgotPassword } = this.props
    this.setState({fireRedirect: true})
    e.preventDefault()
    onForgotPassword(this.state.email)
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
    if(this.state.fireRedirect && this.props.user.error.success === true){
      if (typeof document !== 'undefined'){
        Router.push('/createpassword')
      }
      return(<div></div>)
    }
    else{
      const { classes } = this.props
      return (
        <form className={classes.container} noValidate autoComplete="off"
          onKeyPress={(event) => this.keypress(event)}>
          <Typography variant="display2" style={{color:'black'}} gutterBottom>
            Forgot Password?
          </Typography>
          <Typography variant="subheading" className={classes.text} gutterBottom>
            Some other text
          </Typography>
          <DerbyTextField
            errorText={this.props.user.error.forgot_password_email}
            label="Enter your email"
            value={this.state.email}
            onChange = {this.handleChange()}
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

ForgotPasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user : state.user
    }),
  dispatch =>
    ({
      onForgotPassword(email) {
        dispatch(
          clickedForgotPassword(email))
      }
    }))(withStyles(styles)(ForgotPasswordForm))



const R = require('ramda')
import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import {connect} from 'react-redux'
import Link from 'next/link'
import Router, {withRouter} from 'next/router'

import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import {clickedSignup} from '../actions/auth-actions'

const styles = (theme) => ({
  container: {
    maxWidth: 450,
    padding: '3em',
    margin: '0 auto',
    '& a': {
      textDecoration: 'none',
      color: theme.palette.grey['800']
    }
  },
  title: {
    fontFamily: 'HorsebackSlab',
    color: theme.palette.primary.main,
  },
  textField: {
    marginBottom: '0.5em',
    // borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
  submit: {
    margin: '2em 1em 1.5em',
    padding: '1em 3em',
    background: '#E9AA45',
    color: 'white',
    borderRadius: 0,
    alignSelf: 'center'
  },
})

const FIELDS = [
  {name: 'username', label: 'Username'},
  {name: 'password', label: 'Password', type: 'password'},
  {name: 'confirm_password', label: 'Confirm Password', type: 'password'},
  {name: 'email', label: 'Email Address'},
  {name: 'confirm_email', label: 'Confirm Email Address'},
  {name: 'first_name', label: 'First Name'},
  {name: 'last_name', label: 'Last Name'},
]

class SignupForm extends React.Component {
  constructor(props) {
    super(props)
    autobind(this)
    this.state = {username:'', password:'', confirm_password: '', first_name:'', last_name:'', email:'', dirty: false, loading: false}
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value, dirty: true})
  }

  handleValidate() {
    if (this.state.email !== this.state.confirm_email) return this.setState({errors: {confirm_email: 'Email does not match!'}, dirty: false})
    if (this.state.password !== this.state.confirm_password) return this.setState({errors: {confirm_password: 'Passwords does not match!'}, dirty: false})
    return true
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.handleValidate()) {
      const {onSignup, router} = this.props
      this.setState({loading: true}, () => {
        onSignup(...R.props(['username', 'first_name', 'last_name', 'email', 'password'], this.state))
          .then((response) => {
            const {id} = this.props.user
            response.type === 'SIGNUP_FAIL'
            ? this.setState({dirty: false, loading: false, errors: Object.assign(
              {},
              response.error.signup_email && {email: response.error.signup_email},
              response.error.signup_username && {username: response.error.signup_username},
              response.error.signup_password && {password: response.error.signup_password},
            )})
            : (id && router.push(`/email-verification?i=${id}`))
          }) 
      })
    }
  }

  renderField({name, label, type, ...rest}) {
    const { classes } = this.props
    const errorMessage = R.path(['errors', name], this.state)
    const error = !this.state.dirty && errorMessage
    return (
      <TextField
        className={classes.textField}
        name={name}
        error={error}
        helperText={error}
        label={label}
        type={type || 'text'}
        value={this.state[name]}
        onChange={this.handleChange}
        {...rest}
      />
    )
  }

  render() {
    const { classes } = this.props
    return (
      <Grid 
        className={classes.container}
        component="form"
        direction="column"
        onSubmit={this.handleSubmit}
        noValidate
        autoComplete="off"
        container
      >
        <Typography
          className={classes.title}
          variant="display1"
          gutterBottom
          align="center"
        >
          Signup
        </Typography>
        {FIELDS.map(this.renderField)}
        <Button
          className={classes.submit}
          raised
          type="submit"
          disabled={this.state.loading}
          children={this.state.loading ? 'LOADING...' : 'SUBMIT'}
        />
        <Button raised color="accent">
          <Link href="/login">ALREADY HAVE AN ACCOUNT? LOGIN.</Link>
        </Button>
      </Grid>
    )
  }
}

SignupForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['user']), {onSignup: clickedSignup}),
)(SignupForm)

const R = require('ramda')
import React, {Component} from 'react'
import Link from 'next/link'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import autobind from 'react-autobind'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import {clickedLogin} from '../actions/auth-actions'

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
  },
  submit: {
    margin: '2em 1em 1.5em',
    padding: '1em 3em',
    background: '#E9AA45',
    color: 'white',
    borderRadius: 0,
    alignSelf: 'center'
  },
  actions: {
    buttons: {
      textAlign: 'center'
    }
  }
})

const FIELDS = [
  {name: 'username', label: 'Username'},
  {name: 'password', label: 'Password', type: 'password'},
]

class LoginForm extends Component {
  constructor(props) {
    super(props)
    autobind(this)
    this.state = {username: '', password: '', formError: ''}
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault()
    const {onLogin, router} = this.props
    onLogin(...R.props(['username', 'password'], this.state))
      .then((response) => {
        if (response.type === 'LOGIN_FAIL') {
          this.setState({formError: response.error.form})
        } else {
          const {user: {loggedIn}, previousPage, router} = this.props
          loggedIn && router.push('/')
        }
      })
  }

  renderField({name, label, type, ...rest}) {
    const { classes } = this.props
    const errorMessage = R.path(['user', 'error', `signup_${name}`], this.props) || R.path(['errors', name], this.state)
    return (
      <TextField
        className={classes.textField}
        name={name}
        error={R.not(R.isNil(errorMessage))}
        helperText={errorMessage}
        label={label}
        type={type || 'text'}
        value={this.state[name]}
        onChange={this.handleChange}
        {...rest}
      />
    )
  }

  render() {
    const {classes} = this.props
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
          Login
        </Typography>
        {FIELDS.map(this.renderField)}
        <Button
          className={classes.submit}
          raised
          type="submit"
          children="Login"
        />
        <Grid container>
          <Grid className={classes.actions.button} item xs={12} component={Button} raised color="accent">
            <Link href="/signup">DON'T HAVE AN ACCOUNT? SIGNUP.</Link>
          </Grid>
          <Grid className={classes.actions.button} item xs={6} component={Button} raised color="accent">
            <Link href="/signup">FORGOT USERNAME</Link>
          </Grid>
          <Grid className={classes.actions.button} item xs={6} component={Button} raised color="accent">
            <Link href="/forgotpassword">FORGOT PASSWORD</Link>
          </Grid>
        </Grid>
        {!!this.state.formError.length && (
          <Typography
            paragraph={true}
            color="error"
            align="center"
            dangerouslySetInnerHTML={{__html: this.state.formError}}
          />
        )}
      </Grid>
    )
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['user', 'previousPage']), {onLogin: clickedLogin})
)(LoginForm)

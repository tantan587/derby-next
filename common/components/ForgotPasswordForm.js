const R = require('ramda')
import {Component} from 'react'
import { connect } from 'react-redux'
import {withRouter} from 'next/router'
import autobind from 'react-autobind'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import {clickedForgotPassword} from '../actions/auth-actions'
import SuccessSnackbar from './UI/SuccessSnackbar'

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
  {name: 'email', label: 'Email'},
]

class ForgotPasswordForm extends Component {
  constructor(props) {
    super(props)
    autobind(this)
    this.state = {email: '', loading: false, error: '', snackbar: false}
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value, dirty: true})
  }

  handleSubmit(e) {
    e.preventDefault()
    const {onForgotPassword} = this.props
    this.setState({loading: true}, () => {
      onForgotPassword(...R.props(['email'], this.state))
        .then(() => {
          const {user: {error: {success, forgot_password_email}}, router} = this.props
          success && router.push('/createpassword') && this.setState({snackbar: true})
          forgot_password_email && this.setState({error: forgot_password_email, loading: false, dirty: false})
        })
    })
  }
  
  handleClose = (event, reason) => {
    this.setState({snackbar: false})
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
          Forgot Password
        </Typography>
        {FIELDS.map(this.renderField)}
        <Button
          className={classes.submit}
          raised
          type="submit"
          children={this.state.loading ? 'LOADING...' : 'SUBMIT'}
          disabled={this.state.loading}
        />
        {!!this.state.error.length && !this.state.dirty && <Typography align="center" color="error" children={this.state.error} paragraph/>}
        <div style={{height:700}}/>
        <SuccessSnackbar onClose={this.handleClose} stateKey={this.state.snackbar} message='Email sent' />
      </Grid>
    )
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['user']), {onForgotPassword: clickedForgotPassword})
)(ForgotPasswordForm)

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
import {clickedCreatePassword} from '../actions/auth-actions'

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
})

const FIELDS = [
  {name: 'username', label: 'Username'},
  {name: 'password', label: 'Temporary Password', type: 'password'},
  {name: 'newPassword', label: 'New Password', type: 'password'},
]

class CreatePasswordForm extends Component {
  constructor(props) {
    super(props)
    autobind(this)
    this.state = {username: '', password: '', newPassword: '', loading: false, error: '', dirty: false}
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value, dirty: 'true'})
  }

  handleSubmit(e) {
    e.preventDefault()
    const {onCreatePassword} = this.props
    this.setState({loading: true}, () => {
      onCreatePassword(...R.props(['username', 'password', 'newPassword'], this.state))
        .then(() => {
          const {user: {error: {success1, create_password_password}}, router} = this.props
          success1 && router.push('/login?SB=YHSCUPPL')
          create_password_password && this.setState({loading: false, error: create_password_password, dirty: false})
        })
    })
  }

  renderField({name, label, type, ...rest}) {
    const { classes } = this.props
    const errorMessage = R.path(['user', 'error', `create_password_${name}`], this.props) || R.path(['errors', name], this.state)
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
          Create New Password
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
      </Grid>
    )
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['user']), {onCreatePassword: clickedCreatePassword})
)(CreatePasswordForm)

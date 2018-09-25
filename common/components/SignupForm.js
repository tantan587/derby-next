const R = require('ramda')
import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import {connect} from 'react-redux'
import Link from 'next/link'
import {withRouter} from 'next/router'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
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
  field: {
    marginBottom: '0.5em',
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
  {name: 'last_name', label: 'Last Name'}
]

const genders = [
  {
    value: 'M',
    label: 'Male',
  },
  {
    value: 'F',
    label: 'Female',
  },
  {
    value: 'NA',
    label: 'N/A',
  },
]


class SignupForm extends React.Component {
  constructor(props) {
    super(props)
    autobind(this)
    this.state = {
      username:'', 
      password:'', 
      confirm_password: '', 
      confirm_email: '', 
      first_name:'', 
      last_name:'', 
      email:'', 
      gender:'NA', 
      birthday: '1980-01-01', 
      terms: false, 
      dirty: false, 
      loading: false,
      triedOnce: false}
  }

  handleChange = name => event => {
    if(name==='terms'){
      this.setState({[name]: event.target.checked, dirty: true})
    }
    else{
      this.setState({[name]: event.target.value, dirty: true})
    }
  }


  handleValidate() {
    if (this.state.email !== this.state.confirm_email) return this.setState({errors: {confirm_email: 'Email does not match!'}, dirty: false})
    if (this.state.password !== this.state.confirm_password) return this.setState({errors: {confirm_password: 'Passwords does not match!'}, dirty: false})
    if ((new Date()).getTime() - (new Date(this.state.birthday).getTime()) < 568036800000) return this.setState({errors: {birthday: 'You must be over 18 years old to play'}, dirty: false})
    
    this.setState({errors:{}})
    if (!this.state.terms) return this.setState({dirty: false})
    return true
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.handleValidate()) {
      const {onSignup, router} = this.props
      this.setState({loading: true}, () => {
        onSignup(...R.props(['username', 'first_name', 'last_name', 'email', 'password', 'gender', 'birthday', 'terms'], this.state))
          .then((response) => {
            const {id} = response
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
    else{
      this.setState({triedOnce:true})
    }
  }


  renderField({name, label, type, ...rest}) {
    const { classes } = this.props
    const errorMessage = R.path(['errors', name], this.state)
    const error = !this.state.dirty && errorMessage

    return (
      <TextField
        key={name}
        className={classes.textField}
        name={name}
        error={error}
        helperText={error}
        id={name}
        label={label}
        type={type || 'text'}
        value={this.state[name]}
        onChange={this.handleChange(name)}
        {...rest}
      />
    )
  }

  render() {

    const { classes } = this.props
    const termError = !this.state.terms && this.state.triedOnce && !this.state.dirty
    const birthdayErrorText = !this.state.dirty &&  R.path(['errors', 'birthday'], this.state)


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
          Sign up
        </Typography>
        {FIELDS.map(this.renderField)}
        <TextField
          id="select-gender"
          select
          label="Gender"
          className={classes.textField}
          value={this.state.gender}
          onChange={this.handleChange('gender')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
        >
          {genders.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="date"
          label="Birthday"
          type="date"
          error={birthdayErrorText ? true : false}
          onChange={this.handleChange('birthday')}
          defaultValue="1980-01-01"
          className={classes.textField}
          helperText={birthdayErrorText}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <br/>
        <div style={{display:'flex'}}>
          <Checkbox
            checked={this.state.terms}
            onChange={this.handleChange('terms')}
            value ={this.state.terms}
          />
          <Typography style ={{color: termError ? 'red':'grey'}}>
               Click here to indicate that you have read, understand and accept our
            <Link component='a' href='/legal' > 
              {' Terms and Conditions'}
            </Link> and 
            <Link component='a' href='/privacy' >{' Privacy Policy'}</Link>
          </Typography>
        </div>
        <Button
          className={classes.submit}
          type="submit"
          disabled={this.state.loading}
          children={this.state.loading ? 'LOADING...' : 'SUBMIT'}
        />
        <Link href="/login">
          <Button>
            ALREADY HAVE AN ACCOUNT? LOG IN.
          </Button>
        </Link>
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

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
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormGroup from '@material-ui/core/FormGroup'



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
  {
    value: 'Other',
    label: 'Other',
  },
];


class SignupForm extends React.Component {
  constructor(props) {
    super(props)
    autobind(this)
    this.state = {username:'', password:'', confirm_password: '', first_name:'', last_name:'', email:'', gender:'', birthday: '', terms: false, dirty: false, loading: false}
  }

  handleChange = name => event => {
    if(name==='terms'){
      this.setState({[name]: event.target.checked, dirty: true})
    }else{
      this.setState({[name]: event.target.value, dirty: true})
    }
 
  }


  handleValidate() {
    if (this.state.email !== this.state.confirm_email) return this.setState({errors: {confirm_email: 'Email does not match!'}, dirty: false})
    if (this.state.password !== this.state.confirm_password) return this.setState({errors: {confirm_password: 'Passwords does not match!'}, dirty: false})
    if (this.state.birthday - new Date() < 220752000000) return this.setState({errors: {birthday: 'You must be over 18 years old to play'}, dirty: false})
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
  }


  renderField({name, label, type, ...rest}) {
    const { classes } = this.props
    const errorMessage = R.path(['errors', name], this.state)
    const error = !this.state.dirty && errorMessage
    // if(this.name === gender){
    //   return(
        
    //   )
    // }
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
    const error = this.state.terms === false
    const birthday_error = R.path(['errors', 'birthday'], this.state.birthday)

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
            error={birthday_error}
            onChange={this.handleChange('birthday')}
            defaultValue="1990-05-13"
            className={classes.textField}
            helperText="You must be over 18 to play"
            InputLabelProps={{
              shrink: true,
            }}
      />
      <FormGroup>
        <FormControl
          required error = {error} component = "fieldset" className = {classes.formControl}
          >
            <Checkbox
              checked={this.state.terms}
              onChange={this.handleChange('terms')}
              value = "terms"
            />
          <FormHelperText>By clicking this box, you indicate that you have read, that you understand and that you accept our  
          <Link component='a' href='/legal'> Terms and Conditions</Link> and <Link component='a' href='/privacy' >Privacy Policy</Link></FormHelperText>
        </FormControl>
        </FormGroup>

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

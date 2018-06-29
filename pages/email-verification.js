const R = require('ramda')
import {connect} from 'react-redux'
import React, {Component} from 'react'
import MaskedInput from 'react-text-mask'
import autobind from 'react-autobind'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import {withStyles} from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import LayoutUser from '../common/components/LayoutUser'
import withRoot from '../common/components/withRoot'
import {isVerified, doVerify, doResend} from '../common/actions/auth-actions'
import EMAIL_VERIFICATION from '../common/constants/email_verification'

const styles = (theme) => ({
  container: {
    padding: '50px 20px',
  },
  title: {
    fontFamily: 'HorsebackSlab',
    color: theme.palette.primary.main,
  },
  code: {
    width: '100%',
    fontSize: '3em',
    marginBottom: '10px',
    '& > input': {
      textAlign: 'center',
    },
  },
  withError: {
    color: 'red',
  },
  resubmit: {
    padding: '1em 3em',
    background: '#E9AA45',
    color: 'white',
    borderRadius: 0,
    margin: '0 auto'
  },
})

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[/\d/, ' ', /\d/, ' ', /\d/, ' ', /\d/]}
      placeholderChar={'_'}
      guide={true}
      keepCharPositions={false}
      showMask
    />
  );
}

const STATUS = {
  INITIALIZING: 'INITIALIZING',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED',
  INVALID: 'INVALID',
  COMPLETE: 'COMPLETE',
}

const META = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
}

class EmailVerification extends Component {
  constructor(props) {
    super(props)
    autobind(this)
    this.state = {code: '', timeLeft: 60, status: STATUS.INITIALIZING, snackbar: true, serverResponse: {}}
  }

  componentDidMount() {
    const {i: user_id, c: verification_code} = this.props.url.query;
    (user_id && verification_code)
      ? this.handleDoVerify(user_id, verification_code)
      : this.handleIsValid(user_id)
  }

  async handleIsValid(user_id) {
    const response = await this.props.isVerified(user_id)
    if (response.ok) {
      const {expires_at, number_of_tries} = await response.json()
      const expiresAt = (new Date(expires_at)).getTime()  
      const isExpired = Date.now() > expiresAt
      this.setState({
        status: isExpired ? STATUS.EXPIRED : STATUS.VALID, 
        serverResponse: Object.assign(
          {number_of_tries: number_of_tries}, 
          number_of_tries >= 5 && {type: EMAIL_VERIFICATION.LIMIT_EXCEEDED}
        ),
      })
    } else {
      this.setState({status: STATUS.INVALID})
    }
  }

  async handleDoVerify(user_id, verification_code) {
    const serverResponse = await this.props.doVerify(user_id, verification_code.replace(/\s/g, ''))
    if (serverResponse.ok) {
      this.setState({status: STATUS.COMPLETE})
    } else {
      serverResponse.json().then(payload => this.setState({meta: META.FAILURE, serverResponse: payload}))
    }
  }

  handleCodeChange(e) {
    this.setState({ code: e.target.value }, () => {
      const isValid = /\d\s\d\s\d\s\d/.test(this.state.code)
      if (isValid) {
        const {i: user_id} = this.props.url.query
        this.setState({meta: META.LOADING})
        this.handleDoVerify(user_id, this.state.code)
      }
    })
  }

  async handleResend() {
    const {i: user_id} = this.props.url.query
    const response = await this.props.doResend(user_id).then()
    if (response.ok) window.location.reload()
  }

  determineStatus() {
    const toProper = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase()
    switch(this.state.serverResponse.type) {
    case EMAIL_VERIFICATION.LIMIT_EXCEEDED: return this.showExpired() 
    case EMAIL_VERIFICATION.NOT_FOUND: return this.showInvalid()
    default: 
      return this[`show${toProper(STATUS[this.state.status])}`]()  
    }
  }

  hideSnackbar() {
    this.setState({snackbar: false})
  }

  showInitializing() {
    return (
      this.state.meta === META.FAILURE
      ? 'Code has expired.'
      : 'Loading.'
    )
  }

  showValid() {
    const hasError = this.state.meta === META.FAILURE && /\d\s\d\s\d\s\d/.test(this.state.code)
    const {number_of_tries} = this.state.serverResponse

    return (
      <Grid
        item
        md={6}
      >
        <Typography align="center" variant="display1" className={this.props.classes.title} paragraph={true}>Saddle Up</Typography>
        <Typography align="center" variant="subheading" paragraph={true}>We sent a 4-digit code to your email address. Verify it here:</Typography>
        <Input
          disabled={this.state.meta === META.LOADING}
          onChange={this.handleCodeChange}
          className={classNames(this.props.classes.code, {[this.props.classes.withError]: hasError})}
          inputComponent={TextMaskCustom}
          disableUnderline={true}
          value={this.state.code}
        />
        <Typography
          align="center"
          color={hasError ? "error" : "default"}
          paragraph={true}
          children={hasError ? `Your code does not match. Please try again. Attempt ${number_of_tries} / 5` : `Attempt ${number_of_tries} / 5`}
        />
        <Typography align="center" paragraph={true}>
          <Button onClick={this.handleResend} className={this.props.classes.resubmit} variant="contained" color="default">
            Resend Email
          </Button>
        </Typography>
        {number_of_tries === 0 && (
          <Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            open={this.state.snackbar}
            autoHideDuration={6000}
            message="Email has been sent."
            action={(
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.hideSnackbar}
              >
                <CloseIcon />
              </IconButton>
            )}
          />
        )}
      </Grid>
    )
  }

  headingSubheading(heading, subheading) {
    return [
      <Typography
        key="t-1"
        align="center"
        variant="display1"
        className={this.props.classes.title}
        paragraph={true}
        children={heading}
      />,
      <Typography
        key="t-2"
        align="center"
        variant="subheading"
        paragraph={true}
        children={subheading}
      />
    ]
  }

  showExpired() {
    return (
      <Grid
        item
        md={6}
      >
        {this.headingSubheading('False Start', 'For security, your verification code has timed out. Please click below to send a new code:')}
        <Typography align="center" paragraph={true}>
          <Button onClick={this.handleResend} className={this.props.classes.resubmit} color="default">
            Resend Email
          </Button>
        </Typography>
      </Grid>
    )
  }

  showInvalid() {
    return (
      <Grid
        item
        md={6}
        children={this.headingSubheading('Nothing to do here 404', 'Unfortunately, this link is dead :(')}
      />
    )
  }

  showComplete() {
    setTimeout(() => this.props.url.push('/login'), 5000)
    return (
      <Grid
        item
        md={6}
        children={this.headingSubheading('Success!', 'You should be redirected to login page in a sec.')}
      />
    )

  }

  render() {
    return (
      <LayoutUser>
        <Grid
          container
          alignItems="center"
          justify="center"
          className={this.props.classes.container}
          children={this.determineStatus()}
        />
      </LayoutUser>
    )
  }
}

export default R.compose(
  withRoot,
  withStyles(styles),
  connect(null, {isVerified, doVerify, doResend})
)(EmailVerification)
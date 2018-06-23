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
import CountDown from '../common/components/CountDown'
import {isVerified, doVerify} from '../common/actions/auth-actions'

const styles = {
  container: {
    padding: '20px',
  },
  code: {
    width: '100%',
    fontSize: '3em',
    marginBottom: '10px',
  },
  withError: {
    color: 'red',
  },
}

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
    this.state = {code: '', timeLeft: 60, status: STATUS.INITIALIZING, snackbar: true}
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
      const expiresAt = (new Date(await response.json().then(R.prop('expires_at')))).getTime()  
      const isExpired = Date.now() > expiresAt
      this.setState({status: isExpired ? STATUS.EXPIRED : STATUS.VALID, expiresAt: (expiresAt - Date.now())/(1000)})
    } else {
      this.setState({status: STATUS.INVALID})
    }
  }

  async handleDoVerify(user_id, verification_code) {
    const userHasBeenVerified = await this.props.doVerify(user_id, verification_code.replace(/\s/g, '')).then(R.prop('ok'))
    if (userHasBeenVerified) {
      this.setState({status: STATUS.COMPLETE})
    } else {
      this.setState({meta: META.FAILURE})
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

  determineStatus() {
    const toProper = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase()
    return this[`show${toProper(STATUS[this.state.status])}`]()
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

    return (
      <Grid
        item
        md={6}
      >
        <Typography variant="title" paragraph={true}>Email verification in progress.</Typography>
        <Typography variant="body1" paragraph={true}>You should receive a code in your email.</Typography>
        {this.state.expiresAt && <Typography variant="body1">Time left: <CountDown timeLeft={this.state.expiresAt} onFinish={R.identity} /></Typography>}
        <Input
          disabled={this.state.meta === META.LOADING}
          onChange={this.handleCodeChange}
          className={classNames(this.props.classes.code, {[this.props.classes.withError]: hasError})}
          inputComponent={TextMaskCustom}
          disableUnderline={true}
          value={this.state.code}
        />
        <Typography paragraph={true}>
          <Button variant="contained" color="default" disabled={!this.state.isResendable}>
            Resend Email {!this.state.isResendable && <CountDown timeLeft={this.state.timeLeft} onFinish={this.setResendableTrue} />}
          </Button>
        </Typography>
        {hasError && <Typography variant="body2" color="error" paragraph={true}>Email verification code is wrong. Please try again.</Typography>}
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
      </Grid>
    )
  }

  showExpired() { return 'Expired' }

  showInvalid() { return 'Invalid' }

  showComplete() { return 'Complete' }

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
  connect(null, {isVerified, doVerify})
)(EmailVerification)
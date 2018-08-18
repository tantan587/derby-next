import React from 'react'
import Button from '@material-ui/core/Button'
import Router from 'next/router'
import { handledPressedLogin } from '../../../actions/auth-actions'
import { connect } from 'react-redux'
import PermIdentity from '@material-ui/icons/PermIdentity'

class LoginButton extends React.Component {
  pressedLogin = () => {
    const { onPressedLogin } = this.props
    onPressedLogin()
    Router.push('/login')
  };
  render() {
    const { color, backgroundColor } = this.props
    return (
      <Button 
        style={{float:'right', color: color, backgroundColor:backgroundColor}}
        onClick={() => {this.pressedLogin()}}>         
        <div>
          Log in
        </div>
        <PermIdentity />
      </Button>
    )
  }
}
export default connect(() =>({}),
  dispatch =>
    ({
      onPressedLogin() {
        dispatch(
          handledPressedLogin())
      }
    }))(LoginButton)
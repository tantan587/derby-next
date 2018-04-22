import React from 'react'
import Button from 'material-ui/Button'
import Link from 'next/link'
import { handledPressedLogin } from '../../../actions/auth-actions'
import { connect } from 'react-redux'
import PermIdentity from 'material-ui-icons/PermIdentity'

class LoginButton extends React.Component {
  pressedLogin = () => {
    const { onPressedLogin } = this.props
    onPressedLogin()
  };
  render() {
    const { color, backgroundColor } = this.props
    return (
      <Button 
        style={{float:'right', color: color, backgroundColor:backgroundColor}}
        onClick={() => {this.pressedLogin()}}>         
        <Link href="/login">
          <div>
            Login
          </div>
        </Link>
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
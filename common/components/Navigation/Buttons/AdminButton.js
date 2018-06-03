import React from 'react'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import { clickedAdminUpdates } from '../../../actions/auth-actions'
import { connect } from 'react-redux'
import PermIdentity from '@material-ui/icons/PermIdentity'

class LoginButton extends React.Component {
  pressedUpdate = () => {
    const { onPressedUpdate } = this.props
    onPressedUpdate()
  };
  render() {
    const { color, backgroundColor } = this.props
    return (
      <Button 
        style={{float:'right', color: color, backgroundColor:backgroundColor}}
        onClick={() => {this.pressedUpdate()}}>         
        <div>
          Update
        </div>
        <PermIdentity />
      </Button>
    )
  }
}
export default connect(() =>({}),
  dispatch =>
    ({
      onPressedUpdate() {
        dispatch(
          clickedAdminUpdates())
      }
    }))(LoginButton)
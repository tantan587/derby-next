import React from 'react'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import PermIdentity from '@material-ui/icons/PermIdentity'

class LogoutButton extends React.Component {

  render() {
    const { color, backgroundColor } = this.props
    return (
      <Link href="/logout">
        <Button style={{float:'right', color: color, backgroundColor:backgroundColor}}>
          <div>
            log out
          </div>
          <PermIdentity />
        </Button>
      </Link>
    )
  }
}
export default LogoutButton
import React from 'react'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import PermIdentity from '@material-ui/icons/PermIdentity'

class LogoutButton extends React.Component {
  render() {
    const { color, backgroundColor } = this.props
    return (
      <Button style={{float:'right', color: color, backgroundColor:backgroundColor}}>
        <Link href="/logout">
          <div>
            logout
          </div>
        </Link>
        <PermIdentity />
      </Button>
    )
  }
}
export default LogoutButton
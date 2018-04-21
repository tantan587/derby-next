import React from 'react'
import Button from 'material-ui/Button'
import Link from 'next/link'

class ParticipateButton extends React.Component {
  render() {
    const { color, backgroundColor } = this.props
    return (
      <Button style={{backgroundColor:backgroundColor, color: color}}>     
        <Link href="/participate">
          <div>
          Create/Join League
          </div>
        </Link>
      </Button>
    )
  }
}
export default ParticipateButton
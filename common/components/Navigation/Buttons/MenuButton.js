import React from 'react'
import Button from 'material-ui/Button'
import Link from 'next/link'

class MenuButton extends React.Component {
  render() {
    const { color, backgroundColor, link, name } = this.props
    return (
      <Button style={{backgroundColor:backgroundColor, color: color}}>     
        <Link href={link}>
          <div>
            {name}
          </div>
        </Link>
      </Button>
    )
  }
}
export default MenuButton
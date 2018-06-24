import React from 'react'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import HomeLogoIcon from '../../Icons/HomeLogoIcon'

class MenuButton extends React.Component {
  render() {
    const { color, backgroundColor, link, name, isHomeLogo } = this.props
    return (
      <Link href={link}>
        <Button style={{backgroundColor:backgroundColor, color: color}}>     
          <div>
            {isHomeLogo ? <HomeLogoIcon color={color} height={50} width={160} /> : name}
          </div>
        </Button>
      </Link>
    )
  }
}
export default MenuButton
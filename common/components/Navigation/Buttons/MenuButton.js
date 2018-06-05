import React from 'react'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import HomeLogoIconSmall from '../../Icons/HomeLogoIconSmall'

class MenuButton extends React.Component {
  render() {
    const { color, backgroundColor, link, name, isHomeLogo } = this.props
    return (
      <Link href={link}>
        <Button style={{backgroundColor:backgroundColor, color: color}}>     
          <div>
            {isHomeLogo ? <HomeLogoIconSmall color={color}/> : name}
          </div>
        </Button>
      </Link>
    )
  }
}
export default MenuButton
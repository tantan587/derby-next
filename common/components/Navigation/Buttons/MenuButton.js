import React from 'react'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import HomeLogoIconSmall from '../../Icons/HomeLogoIconSmall'

class MenuButton extends React.Component {
  render() {
    const { color, backgroundColor, link, name, isHomeLogo } = this.props
    return (
      <Button style={{backgroundColor:backgroundColor, color: color}}>     
        <Link href={link}>
          <div>
            {isHomeLogo ? <HomeLogoIconSmall color={color}/> : name}
          </div>
        </Link>
      </Button>
    )
  }
}
export default MenuButton
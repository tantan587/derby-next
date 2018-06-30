import React from 'react'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'

class IconText extends React.Component {

  
  render() {
    const {src, name,boxStyle, textStyle, iconStyle, link} = this.props
    return (
      <Link href={link}>
        <div style={{...boxStyle, display:'inline-block',cursor: 'pointer'}}> 
          <img src={src} alt="none" {...iconStyle}/>
          <Typography style={{...textStyle}}>
            {name}
          </Typography>
        </div> 
      </Link>
    )
  }
}
export default IconText
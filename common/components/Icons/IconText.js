import React from 'react'
import Typography from '@material-ui/core/Typography'
class IconText extends React.Component {

  
  render() {
    const {link, name,boxStyle, textStyle, iconStyle} = this.props
    return (
      <div style={{...boxStyle, display:'inline-block'}}> 
        <img src={link} alt="none" {...iconStyle}/>
        <Typography style={{...textStyle}}>
          {name}
        </Typography>
      </div> 
    )
  }
}
export default IconText
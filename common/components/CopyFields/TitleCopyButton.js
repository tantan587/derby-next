import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
class TitleCopyButton extends React.Component {

  render() {
    const {title, copy, 
      buttonText, marginLeft, marginRight} = this.props
    return (
      <div style={{width:250, display:'inline-block', marginLeft:marginLeft,
        marginRight:marginRight}}>
        <Typography 
          variant="title" style={{color:'white', fontFamily:'museo-slab-bold'}}>
          {title}
        </Typography>
        <br/>
        <Typography 
          variant="subheading" style={{color:'white'}}>
          {copy}
        </Typography>
        <Button style={{backgroundColor:'#229246', color:'#ebab38',paddingTop:12}}>
          {buttonText}
        </Button>
      </div> 
    )
  }
}
export default TitleCopyButton
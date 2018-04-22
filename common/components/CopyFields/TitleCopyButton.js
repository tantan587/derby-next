import React from 'react'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
class TitleCopyButton extends React.Component {

  render() {
    const {title, copy, 
      buttonText, marginLeft, marginRight} = this.props
    return (
      <div style={{width:325, display:'inline-block', marginLeft:marginLeft,
        marginRight:marginRight}}>
        <Typography 
          type="title" style={{color:'white', fontFamily:'museo-slab-bold'}}>
          {title}
        </Typography>
        <br/>
        <Typography 
          type="subheading" style={{color:'white'}}>
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
import React from 'react'
import IconText from './IconText'
class HowToPlayIconText extends React.Component {

  
  render() {
    const {link,src, name} = this.props
    return (
      <IconText name={name} link={link} src={src}
        boxStyle={{paddingTop:30, backgroundColor:'#EBAB38', color:'white', 
          height:240, width:270, marginRight:20, marginLeft:20, marginBottom:70}}
        textStyle={{color:'white', paddingTop:30, fontSize:18, fontFamily:'museo-slab-bold'}}
        iconStyle={{height:160, width:160}}/> 
    )
  }
}
export default HowToPlayIconText
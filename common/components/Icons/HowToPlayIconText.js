import React from 'react'
import IconText from './IconText'
class HowToPlayIconText extends React.Component {

  
  render() {
    const {link, name} = this.props
    return (
      <IconText name={name} link={link} 
        boxStyle={{paddingTop:30, backgroundColor:'#EBAB38', color:'white', 
          height:270, width:300, marginRight:40, marginLeft:40, marginBottom:80}}
        textStyle={{color:'white', paddingTop:30, fontSize:20, fontFamily:'museo-slab-bold'}}
        iconStyle={{height:180, width:180}}/> 
    )
  }
}
export default HowToPlayIconText
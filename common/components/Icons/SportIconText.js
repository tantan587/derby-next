import React from 'react'
import IconText from './IconText'
class SportIconText extends React.Component {

  
  render() {
    const {src, name} = this.props
    return (
      <IconText name={name} src={src} 
        textStyle={{color:'white'}}
        boxStyle={{width:80}}
        iconStyle={{width:30, height:'auto'}}/> 
    )
  }
}
export default SportIconText
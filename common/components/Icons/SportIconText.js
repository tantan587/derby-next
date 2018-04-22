import React from 'react'
import IconText from './IconText'
class SportIconText extends React.Component {

  
  render() {
    const {link, name} = this.props
    return (
      <IconText name={name} link={link} 
        textStyle={{color:'white'}}
        boxStyle={{width:80}}
        iconStyle={{width:30, height:30}}/> 
    )
  }
}
export default SportIconText
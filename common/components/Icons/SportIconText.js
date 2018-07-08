import React from 'react'
import SportIcon from './SportIcon'
import SportText from './SportText'
class SportIconText extends React.Component {

  render() {
    const {sportId, color,tabInd} = this.props
    return (
      <div style={tabInd ?{position:'absolute', bottom:0} : {width:80, display:'inline-block'}}> 
        <SportIcon 
          color={color ? color : 'white'} 
          sportId={sportId}
        />
        <SportText sportId={sportId} color={color}/>
      </div> 
    )
  }
}
export default SportIconText
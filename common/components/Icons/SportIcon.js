import React from 'react'
import SportIconSvg from './SportIconSvg'
import sportLeagues from '../../../data/sportLeagues.json'
class SportIcon extends React.Component {

  render() {
    const {sportId, color, style} = this.props
    let sportLeague = sportLeagues[sportId]
    return (
      <SportIconSvg 
        color={color ? color : 'white'} 
        pattern={sportLeague.srcStr}
        style={style}
        viewBox={sportLeague.viewBox}
      />
    )
  }
}
export default SportIcon
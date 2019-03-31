import React from 'react'
import SportIconSvg from './SportIconSvg'
import sportLeagues from '../../../data/sportLeagues.json'
class SportIcon extends React.Component {

  render() {
    const {sportId, color, iconColor, style} = this.props
    let sportLeague = sportLeagues[sportId]
    return (
      <SportIconSvg 
        color={ iconColor ? iconColor :
          color ? color : 'white' } 
        pattern={sportLeague.srcStr}
        style={style}
        viewBox={sportLeague.viewBox}
      />
    )
  }
}
export default SportIcon
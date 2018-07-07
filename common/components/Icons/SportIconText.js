import React from 'react'
import Typography from '@material-ui/core/Typography'
import SportIcon from './SportIcon'
import sportLeagues from '../../../data/sportLeagues.json'
class SportIconText extends React.Component {

  render() {
    const {sportId, color,tabInd} = this.props
    let sportLeague = sportLeagues[sportId]
    return (
      <div style={tabInd ?{position:'absolute', bottom:0} : {width:80, display:'inline-block'}}> 
        <SportIcon 
          color={color ? color : 'white'} 
          pattern={sportLeague.srcStr}
          viewBox={sportLeague.viewBox}
        />
        <Typography style={{color:color ? color : 'white'}}>
          {sportLeague.displayName}
        </Typography>
      </div> 
    )
  }
}
export default SportIconText
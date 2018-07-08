import React from 'react'
import Typography from '@material-ui/core/Typography'
import sportLeagues from '../../../data/sportLeagues.json'
class SportText extends React.Component {

  render() {
    const {sportId, color} = this.props
    let sportLeague = sportLeagues[sportId]
    return (
      <Typography style={{color:color ? color : 'white'}}>
        {sportLeague && sportLeague.displayName ? sportLeague.displayName : sportId}
      </Typography>
    )
  }
}
export default SportText
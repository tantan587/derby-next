import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import {GetCountdownTimeStr, myTimeout} from '../../lib/time'


class DraftHeader extends React.Component {

  render()
  {
    const {startTime, league_name, mode, myTurn} = this.props
    
    if (mode === 'pre')
    {
      return (
        <div>
          <Typography variant='headline'> {league_name}</Typography>
          <br/>
          <Typography variant='title'>{'Time until draft: ' + GetCountdownTimeStr(startTime)}</Typography>
        </div>
      ) 
    }

    if (mode === 'wait')
    {
      return (
        <div>
          <Typography variant='headline'> {league_name}</Typography>
          <Typography variant='title'> Waiting for draft to start</Typography>
        </div>
      )
    }

    if (mode === 'live')
    {
      return (
        <div>
          <Typography variant='headline'> {league_name}</Typography>
          <Typography variant='headline'> Draft is Live!</Typography>
          {myTurn
            ? <Typography variant='title'> Your Turn!</Typography>
            : <div/>
          }
        </div>
      )
    }

    if (mode === 'post')
    {
      return (
        <div>
          <Typography variant='headline'> {league_name}</Typography>
          <Typography variant='headline'> Draft is Over</Typography>
        </div>
      )
    }
  }


}

export default DraftHeader
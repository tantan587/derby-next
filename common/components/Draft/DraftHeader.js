import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import {GetCountdownTimeStr, myTimeout} from '../../lib/time'


class DraftHeader extends React.Component {

  render()
  {
    const {startTime, league_name, mode} = this.props
    
    if (mode === 'pre')
    {
      return (
        <div>
          <Typography type='headline'> {league_name}</Typography>
          <br/>
          <Typography type='title'>{'Time until draft: ' + GetCountdownTimeStr(startTime)}</Typography>
        </div>
      ) 
    }

    if (mode === 'wait')
    {
      return (
        <div>
          <Typography type='headline'> {league_name}</Typography>
          <Typography type='title'> Waiting for draft to start</Typography>
        </div>
      )
    }

    if (mode === 'live')
    {
      return (
        <div>
          <Typography type='headline'> {league_name}</Typography>
          <Typography type='headline'> Draft is Live!</Typography>
        </div>
      )
    }

    if (mode === 'post')
    {
      return (
        <div>
          <Typography type='headline'> {league_name}</Typography>
          <Typography type='headline'> Draft is Over</Typography>
        </div>
      )
    }
  }


}

export default DraftHeader
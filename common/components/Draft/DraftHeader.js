import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import {GetCountdownTimeStr, myTimeout} from '../../lib/time'


class DraftHeader extends React.Component {

  render()
  {
    const {startTime, league_name, draftState, onTick, startTimerId, updateTimerId} = this.props
    
    if (draftState === 'pre')
    {
      //continue
      if (startTime > 0 && startTimerId === 0)
      {
        let timerId = setInterval(onTick, 1000)
        updateTimerId('startTimerId', timerId)
      }
      //stop
      else if(startTime===0 && startTimerId !== 0)
      {
        clearInterval(isNaN(startTimerId) ? startTimerId._id : startTimerId)
        updateTimerId('startTimerId', 0)
      }

      return (
        <div>
          <Typography type='headline'> {league_name}</Typography>
          <br/>
          <Typography type='title'>{'Time until draft: ' + GetCountdownTimeStr(startTime)}</Typography>
        </div>
      ) 
    }

    if (draftState === 'wait')
    {
      return (
        <div>
          <Typography type='headline'> {league_name}</Typography>
          <Typography type='title'> Waiting for draft to start</Typography>
        </div>
      )
    }

    if (draftState === 'live')
    {
      return (
        <div>
          <Typography type='headline'> {league_name}</Typography>
          <Typography type='headline'> Draft is Live!</Typography>
        </div>
      )
    }

    if (draftState === 'post')
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
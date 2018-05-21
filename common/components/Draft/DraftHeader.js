import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import {GetCountdownTimeStr} from '../../lib/time'


class DraftHeader extends React.Component {

  render()
  {
    const {startTime, mode, myTurn} = this.props
    let color = '#269349'
    
    let title = ''  
    if (mode === 'pre')
    {

      title = 'Time until draft: ' + GetCountdownTimeStr(startTime)

    }

    if (mode === 'wait')
    {
      title = 'Waiting for draft to start'
    }

    if (mode === 'live')
    {
      title = 'Draft is Live '
      title += myTurn ? 'Your Turn!' : ''
      color = myTurn ? color :'#707070'
      
    }
    if (mode === 'timeout')
    {
      title = 'Draft Is Paused'
    }

    if (mode === 'post')
    {
      title =  'Draft Is Over'
    }
    return <Typography variant='headline' style={{paddingTop:10, paddingBottom:10, backgroundColor: color}}>{title}</Typography>
  }


}

export default DraftHeader
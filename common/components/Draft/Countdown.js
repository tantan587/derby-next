import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import { setInterval, setTimeout } from 'timers';


class Countdown extends React.Component {

  render()
  {
    const { countdownTime, isOn, isPaused, onTick, countdownTimerId, updateTimerId} = this.props
    if(!isPaused)
    {
      //continue
      if (countdownTime > 0  && isOn && countdownTimerId === 0)
      {
        let timerId = setInterval(onTick, 1000)
        updateTimerId('countdownTimerId', timerId)
      }
      //stop
      else if(countdownTime===0 && isOn && countdownTimerId !== 0)
      {
        clearInterval(countdownTimerId._id)
        updateTimerId('countdownTimerId', 0)
      }
      //start
      else if(!isOn && countdownTime >0 && countdownTimerId === 0)
      {
        onTick()
      }
    }
    return (
      <Typography style={{fontSize:30}}>{countdownTime}</Typography>) 
  }


}

Countdown.propTypes = {
  countdownTime: PropTypes.number,
  isOn: PropTypes.bool,
  onTick: PropTypes.func
}

Countdown.defaultProps = {
  countdownTime: 20,
  isOn: true,
  onTick: f=>f
}
  

export default Countdown
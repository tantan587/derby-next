import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'


class Countdown extends React.Component {

  render()
  {
    const { countdownTime, isOn, isPaused, onTick} = this.props
    
    if (countdownTime && isOn && !isPaused)
    {
      this.timerId = setTimeout(onTick, 1000)
    }

    if(!isOn && !isPaused)
    {
      if(this.timerId)
      {clearTimeout(this.timerId)}
      onTick()
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
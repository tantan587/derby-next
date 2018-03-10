import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'

class Countdown extends React.Component {

  render()
  {
    const { countdownTime} = this.props
    
    return (
      <Typography style={{fontSize:30}}>{countdownTime}</Typography>) 
  }
}

Countdown.propTypes = {
  countdownTime: PropTypes.number,
}

Countdown.defaultProps = {
  countdownTime: 20,
}
  

export default Countdown
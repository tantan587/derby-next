import React from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'

const styles = () => ({
  countdownBase : {
    fontFamily:'digital-7',
    fontSize:55,
    color:'#292929',
    display: 'inline-block'
  },
  countdown : {
    fontFamily:'digital-7',
    fontSize:55,
    color:'#EBAB38',
    display: 'inline-block',
    marginLeft: -123
  },
  title : {
    textAlign : 'center',
    color:'white',
    fontFamily:'museo-slab-bold'
  },
})


class Countdown extends React.Component {

  render()
  {
    const { countdownTime, classes} = this.props
    let minutes = Math.floor(countdownTime / 60)
    let seconds = countdownTime - minutes * 60
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    return (
      //{countdownTime}
      <div>
        <br/>
        <Typography className={classes.title} type="body2">{'DRAFT CLOCK'}</Typography>
        <Typography className={classes.countdownBase}>88:88</Typography>
        <Typography className={classes.countdown}>{minutes}:{seconds}</Typography>
      </div>
    ) 
  }
}

Countdown.propTypes = {
  countdownTime: PropTypes.number,
}

Countdown.defaultProps = {
  countdownTime: 20,
}
  

export default withStyles(styles)(Countdown)
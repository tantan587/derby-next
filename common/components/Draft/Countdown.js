import React from 'react'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import {GetCountdownTimeObj} from '../../lib/time'


const styles = () => ({
  countdownBase : {
    fontFamily:'digital-7',
    fontSize:65,
    color:'#292929',
    display: 'inline-block'
  },
  countdown : {
    fontFamily:'digital-7',
    fontSize:65,
    color:'#EBAB38',
    display: 'inline-block',
  },
  countdownAlert : {
    fontFamily:'digital-7',
    fontSize:65,
    color:'#b30000',
    display: 'inline-block',
  },
  title : {
    textAlign : 'center',
    color:'white',
    fontFamily:'museo-slab-bold'
  },
  preDraft : {fontFamily:'digital-7',fontSize:40,color:'#EBAB38'},
  preDraftBase : {fontFamily:'digital-7',fontSize:40,color:'#292929'},
  time :{
    color:'white',fontSize:12, fontFamily:'museo-slab-bold', marginTop:-25, marginBottom:35
  }
})


class Countdown extends React.Component {

  add0IfLessThanAmount = (time, amount ) => {
    return time < amount ? '0' + time : time
  }
  render()
  {
    let { countdownTime, classes, startTime, mode} = this.props
    let minutes = Math.floor(countdownTime / 60)
    let seconds = countdownTime - minutes * 60
    minutes =  this.add0IfLessThanAmount(minutes,10)
    seconds =  this.add0IfLessThanAmount(seconds,10) 
    
    let toggleColor = countdownTime < 10

    let preDraftTime = GetCountdownTimeObj(startTime)
    preDraftTime.days = this.add0IfLessThanAmount(this.add0IfLessThanAmount(preDraftTime.days,10),100)
    preDraftTime.hours = this.add0IfLessThanAmount(preDraftTime.hours,10)
    preDraftTime.minutes = this.add0IfLessThanAmount(preDraftTime.minutes,10)
    preDraftTime.seconds = this.add0IfLessThanAmount(preDraftTime.seconds,10)

    return (
      //{countdownTime}
      <div>
        <br/>
        {mode === 'post' ?
          <div>
            <Typography className={classes.title} style={{}} variant="subheading">{'DRAFT IS OVER'}</Typography>
            <Typography className={classes.countdownBase}>88</Typography>
            <Typography className={classes.countdownBase} style={{marginLeft:-5}}>:</Typography>
            <Typography className={classes.countdownBase}style={{marginLeft:-5}}>88</Typography>
          </div>
          : mode === 'live' || mode==='timeout' ?
            <div>
              <Typography className={classes.title} variant="subheading">{'DRAFT CLOCK'}</Typography>
              <Typography className={classes.countdownBase}>88</Typography>
              <Typography className={classes.countdownBase} style={{marginLeft:-5}}>:</Typography>
              <Typography className={classes.countdownBase}style={{marginLeft:-5}}>88</Typography>
              <Typography className={toggleColor ? classes.countdownAlert : classes.countdown}style={{marginLeft:-136}}>{minutes}</Typography>
              <Typography className={toggleColor ? classes.countdownAlert : classes.countdown} style={{marginLeft:-5}}>:</Typography>
              <Typography className={toggleColor ? classes.countdownAlert : classes.countdown}style={{marginLeft:-5}}>{seconds}</Typography>
            </div>
            :
            <div>
              <Typography className={classes.title} variant="subheading">{'STARTS IN'}</Typography>
              <div style={{display: 'inline-block'}}>
                <div>
                  <Typography className={classes.preDraftBase}  style={{display: 'inline-block'}}>888</Typography>
                  <Typography style={{marginLeft:-55, display: 'inline-block'}} className={classes.preDraft}>{preDraftTime.days}</Typography>
                </div>
                <br/>
                <Typography  className={classes.time}>{'Days'}</Typography> 
              </div>
              <div style={{display: 'inline-block', marginLeft:12}}>
                <div>
                  <Typography className={classes.preDraftBase}  style={{display: 'inline-block'}}>88</Typography>
                  <Typography style={{marginLeft:-37, display: 'inline-block'}} className={classes.preDraft}>{preDraftTime.hours}</Typography>
                </div>
                <br/>
                <Typography  className={classes.time}>{'Hours'}</Typography> 
              </div>
              <div style={{display: 'inline-block', marginLeft:12}}>
                <div>
                  <Typography className={classes.preDraftBase}  style={{display: 'inline-block'}}>88</Typography>
                  <Typography style={{marginLeft:-37, display: 'inline-block'}} className={classes.preDraft}>{preDraftTime.minutes}</Typography>
                </div>
                <br/>
                <Typography  className={classes.time}>{'Minutes'}</Typography> 
              </div>
              <div style={{display: 'inline-block', marginLeft:12}}>
                <div>
                  <Typography className={classes.preDraftBase}  style={{display: 'inline-block'}}>88</Typography>
                  <Typography style={{marginLeft:-37, display: 'inline-block'}} className={classes.preDraft}>{preDraftTime.seconds}</Typography>
                </div>
                <br/>
                <Typography  className={classes.time}>{'Seconds'}</Typography> 
              </div>
            </div>
        }
      </div>
    ) 
  }
}

Countdown.defaultProps = {
  countdownTime: 20,
}
  

export default withStyles(styles)(Countdown)
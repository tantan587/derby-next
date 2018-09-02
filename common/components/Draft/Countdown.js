import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {GetCountdownTimeObj} from '../../lib/time'
import ContainerDimensions from 'react-container-dimensions'


const styles = () => ({
  countdownBase : {
    fontFamily:'digital-7',
    color:'#393939',
  },
  countdown : {
    fontFamily:'digital-7',
    color:'#EBAB38',
  },
  countdownAlert : {
    fontFamily:'digital-7',
    color:'#b30000',
  },
  title : {
    textAlign : 'center',
    color:'white',
    fontFamily:'museo-slab-bold',
    marginBottom:-15
  },
  time :{ 
    color:'white',
    fontFamily:'museo-slab-bold',
  }
})
//
const TimeBlock = ({classes, displayInfo, parentWidth, preDraftInd, alertInd, noTimeInd}) => {
  let marginTop = (preDraftInd ? -0.247 : -0.363) * parentWidth
  let fontSize = (preDraftInd ? 0.17 : 0.25) * parentWidth
  let marginBottom = (preDraftInd ? 0 : -.05) * parentWidth
  let backgroundText = displayInfo.colon ? ':' : '8'.repeat(displayInfo.time.toString().length)

  return <div style={{display:'flex', flexDirection:'column' }}>
    <Typography style={{fontSize}} className={classes.countdownBase}
      children={backgroundText}/>
    <Typography style={{fontSize, marginTop, marginBottom}} 
      className={alertInd ? classes.countdownAlert : noTimeInd ? classes.countdownBase : classes.countdown} 
      children={displayInfo.time}/>
    <Typography  className={classes.time} style={{fontSize:parentWidth*0.05, marginTop:-0.045*parentWidth}} 
      children={displayInfo.timeType}/>
    }
  </div>
}


class Countdown extends React.Component {

  add0IfLessThanAmount = (time, amount ) => {
    return time < amount ? '0' + time : time
  }
  render()
  {
    let { countdownTime, classes, startTime, mode} = this.props

    let displayTime = []
    let alertInd = false
    let preDraftInd = false
    let noTimeInd = false
    let title = ''

    if (mode === 'post')
    {
      title = 'DRAFT IS OVER'
      noTimeInd = true
      displayTime = [
        {time: 88},
        {time:':', colon:true},
        {time: 88}]
    }
    else if (mode === 'live' || mode==='timeout')
    {
      title = mode === 'live' ? 'DRAFT CLOCK' : 'IN TIMEOUT'
      let minutes = Math.floor(countdownTime / 60)
      let seconds = countdownTime - minutes * 60
      displayTime = [
        {time: this.add0IfLessThanAmount(minutes,10)},
        {time:':', colon:true},
        {time: this.add0IfLessThanAmount(seconds,10)}]
      
      alertInd = countdownTime < 10
    }
    else if (mode === 'pre')
    {
      title = 'STARTS IN'
      preDraftInd=true
      let preDraftTime = GetCountdownTimeObj(startTime)
      displayTime = [
        { timeType : 'Days',
          time: this.add0IfLessThanAmount(this.add0IfLessThanAmount(preDraftTime.days,10),100)
        },
        { timeType : 'Hours',
          time: this.add0IfLessThanAmount(preDraftTime.hours,10)
        },
        { timeType : 'Minutes',
          time: this.add0IfLessThanAmount(preDraftTime.minutes,10)
        },
        { timeType : 'Seconds',
          time: this.add0IfLessThanAmount(preDraftTime.seconds,10)
        }
      ]
    }
    return (
      <div>
        <br/>
        <ContainerDimensions>
          { ({width}) => 
          {return <div>
            <Typography className={classes.title} variant="subheading">{title}</Typography>
            <br/>
            <div style={{display: 'flex', justifyContent:preDraftInd ? 'space-evenly': 'center'}}>
              {displayTime.map((x,i) => 
                <TimeBlock key={i} classes={classes} 
                  displayInfo={x} parentWidth={width} 
                  preDraftInd={preDraftInd} 
                  alertInd={alertInd}
                  noTimeInd={noTimeInd}/>
              )
              }
            </div> 
          </div>
          }
          }
        </ContainerDimensions>
        <br/>
        
      </div>
    ) 
  }
}

Countdown.defaultProps = {
  countdownTime: 20,
}
  

export default withStyles(styles)(Countdown)
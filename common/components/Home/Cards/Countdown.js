import { withStyles } from '@material-ui/core/styles'

import { GetCountdownTimeObj } from '../../../lib/time'

const styles = {
  root: {
    textAlign: 'center',
    fontFamily: 'Roboto'
  },
  bold: {
    fontWeight: 500,
    color: '#717171'
  },
  small: {
    marginTop: 12,
    lineHeight: 1.5,
    fontSize: 12,
    fontWeight: 400,
    color: '#848484'
  },
  centered: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
    //paddingBottom: 0,
    borderBottom: '1px solid #848484'
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'flex-start',
    width: 'calc(100% / 3)'
  },
  time: {
    fontFamily: 'Roboto',
    fontSize: 13,
    textTransform: 'uppercase',
    color: '#848484',
    textAlign:'center',
    //marginLeft:20
  },
  clock: {
    marginTop: 10,
    fontFamily: 'digital-7',
    fontSize: 65,
    color: '#E9AA45'
  }
}

const Countdown = withStyles(styles)(({ classes, startTime }) => {
  const add0IfLessThanAmount = (time, amount ) => {
    return time < amount ? '0' + time : time
  }
  let preDraftTime = GetCountdownTimeObj(startTime)
  preDraftTime.days = add0IfLessThanAmount(add0IfLessThanAmount(preDraftTime.days,10),100)
  preDraftTime.hours = add0IfLessThanAmount(preDraftTime.hours,10)
  preDraftTime.minutes = add0IfLessThanAmount(preDraftTime.minutes,10)
  preDraftTime.seconds = add0IfLessThanAmount(preDraftTime.seconds,10)

  return (
    startTime ?
      <div className={classes.root}>
        <div className={classes.bold}>Your League's live draft begins in</div>
        <div className={`${classes.centered}`}>
          <div className={classes.stack}>
            <div className={classes.time}>Days</div>
            <div className={classes.clock}>{preDraftTime.days}</div>
          </div>
          <div className={classes.stack}>
            <div className={classes.time}>Hours</div>
            <div className={classes.clock}>{preDraftTime.hours}</div>
          </div>
          <div className={classes.stack}>
            <div className={classes.time}>Minutes</div>
            <div className={classes.clock}>{preDraftTime.minutes}</div>
          </div>
        </div>
        <div className={classes.bold} style={{ marginTop: 20 }}>Have you completed your draft preparation?</div>
        <div className={classes.small}>Be sure to visit the Draft Room to plan your strategy and rank your teams.</div>
      </div> :
      <div/>
  )
})

export default Countdown

const R = require('ramda')
import {Component} from 'react'
import classNames from 'classnames'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import {WeekdaysShort} from '../../lib/time'
import {DatePicker} from 'material-ui-pickers'
import { GetWeekOffsetRange } from '../../lib/time'

const styles = (theme) => ({
  week: {
    listStyle: 'none',
    padding: '0',
    margin: '0 20px 0 0',
    display:'flex',
    justifyContent:'center',
    flexWrap:'wrap',
    alignItems:'center'
  },
  arrow: {
    float: 'left',
    width: 36,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '30px',
    '&:hover': { background: 'lightgray' }
  },
  day: {
    float: 'left',
    width: 48,
    height: 48,
    margin: '0 3px',
    cursor: 'pointer',
    '&:hover': { background: 'lightgray' }
  },
  activeDay: {
    color: `${theme.palette.primary.main} !important`,
  },
  Xs: {
    [theme.breakpoints.only('xs')]: {
      display: 'inline'
    },
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    },
  },
  Reg: {
    [theme.breakpoints.up('sm')]: {
      display: 'inline'
    },
    [theme.breakpoints.only('xs')]: {
      display: 'none'
    },
  },
})

const Day = ({classes}, onUpdateDate, currDay) => (date, i) => {
  return (
    <div
      key={i}
      className={classNames(classes.day, {[classes.activeDay]: date.getDay() === currDay})}
      onClick={() => onUpdateDate(date)}
    >
      <Typography
        variant="body2"
        children={WeekdaysShort[date.getDay()]}
        align="center"
        color="inherit"
      />
      <Typography
        variant="subheading"
        children={date.getDate()}
        align="center"
        color="inherit"
      />
    </div>
  )
}



class DayPicker extends Component {

  changeDateByOffset = (date,offset) => {
    const tmp = new Date(date.getTime())
    tmp.setDate(date.getDate() + offset)
    return tmp
  }

  render() {
    const {classes, date, onUpdateDate} = this.props
    let offset = GetWeekOffsetRange(date)
    let offsetXs = GetWeekOffsetRange(date)

    const { end } = offset

    if (5 > end && end > 1) { // HACK
      offsetXs.start += 3     // .getDay() returns an int between 0 and 6
      offsetXs.end += 3       // it's not ideal to assume that a piece
    } else if (end === 1) {   // of UI will be between 0 and 6
      offsetXs.start += 6
      offsetXs.end += 6
    }


    const DateRange = R.range(offset.start, offset.end).map((offset) => {
      return this.changeDateByOffset(date,offset)
    })
    const DateRangeXs = R.range(offset.start, offset.end - 4).map((offset) => {
      return this.changeDateByOffset(date,offset)
    })
    return (
      <div className={classes.week}>
        <div className={classes.arrow}
          onClick={() => onUpdateDate(this.changeDateByOffset(date,-1))}>
          <ChevronLeftIcon fontSize="inherit"/>
        </div>
        <div className={classes.Reg}>
          {DateRange.map(Day({classes}, onUpdateDate, date.getDay()))}
        </div>
        <div className={classes.Xs}>
          {DateRangeXs.map(Day({classes}, onUpdateDate, date.getDay()))}
        </div>
        <div className={classes.arrow}
          onClick={() => onUpdateDate(this.changeDateByOffset(date,1))}>
          <ChevronRightIcon fontSize="inherit"/>
        </div>
        <DatePicker
          style={{marginLeft:20}}
          keyboard
          label="Or pick a date"
          format="MM/dd/yyyy"
          value={date}
          onChange={(d) => onUpdateDate(d)}
          animateYearScrolling={false}
        />
      </div>
    )
  }
}
//display:'flex',justifyContent:'center', flexWrap:'wrap'
export default withStyles(styles)(DayPicker)

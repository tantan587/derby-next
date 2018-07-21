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
  }
})

const Day = ({classes}, onUpdateDate, currDay) => (date, index) => {
  return (
    <div
      className={classNames(classes.day, {[classes.activeDay]: index === currDay})}
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
    const DateRange = R.range(offset.start, offset.end).map((offset) => {
      return this.changeDateByOffset(date,offset)
    })
    return (
      <div className={classes.week}>
        <div className={classes.arrow}
          onClick={() => onUpdateDate(this.changeDateByOffset(date,-1))}>
          <ChevronLeftIcon fontSize="inherit"/></div>
        {DateRange.map(Day({classes}, onUpdateDate, date.getDay()))}
        <div className={classes.arrow}
          onClick={() => onUpdateDate(this.changeDateByOffset(date,1))}>
          <ChevronRightIcon fontSize="inherit"/></div>
        <DatePicker
          style={{marginLeft:20}}
          keyboard
          label="Or pick a date"
          format="MM/DD/YYYY"
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
const R = require('ramda')
import React, {Component} from 'react'
import classNames from 'classnames'
import autobind from 'react-autobind'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DateRangeIcon from '@material-ui/icons/DateRange'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'

import DAYS from './DAYS'

const styles = (theme) => ({
  week: {
    display: 'inline',
    listStyle: 'none',
    padding: '0',
    margin: '0 20px 0 0',
    height: 48,
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

const Day = ({classes}) => (date, index) => {
  return (
    <li
      className={classNames(classes.day, {[classes.activeDay]: index === 3})}
    >
      <Typography
        variant="body2"
        children={DAYS[date.getDay()]}
        align="center"
        color="inherit"
      />
      <Typography
        variant="subheading"
        children={date.getDate()}
        align="center"
        color="inherit"
      />
    </li>
  )
}

class WeekDayPicker extends Component {
  render() {
    const {classes, date} = this.props
    const DateRange = R.range(-3, 4).map((offset) => {
      const tmp = new Date(date.getTime())
      tmp.setDate(date.getDate() + offset)
      return tmp
    })
    return (
      <ul className={classes.week}>
        <li className={classes.arrow}><ChevronLeftIcon fontSize="inherit"/></li>
        {DateRange.map(Day({classes}))}
        <li className={classes.arrow}><ChevronRightIcon fontSize="inherit"/></li>
      </ul>
    )
  }
}

export default withStyles(styles)(WeekDayPicker)
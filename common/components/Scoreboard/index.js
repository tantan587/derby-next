const R = require('ramda')
import {Component} from 'react'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DayPicker from './DayPicker'
import ScoreCard from './ScoreCard'
import {MonthNames, GetWeekOffsetRange } from '../../lib/time'

const styles = theme => ({
  container: {
    padding: '20px 0',
    margin: '0 3%',
  },
  title: {
    fontFamily: 'museo-slab-bold',
    color: theme.palette.primary.main,
  },
  caption: {
    marginTop: 5,
    marginBottom: 15,
    [theme.breakpoints.only('xs')]: {
      display: 'none'
    }
  },
  captionXs: {
    marginTop: 5,
    marginBottom: 15,
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  body1: {
    fontSize: '1em',
    marginTop: 20,
    color: theme.palette.grey.A700,
  },
})

const getDateRangeForWeek = (date) => {

  let offset = GetWeekOffsetRange(date)
  let prev = new Date(date.getTime())
  prev.setDate(date.getDate() + offset.start)
  let next = new Date(date.getTime())
  next.setDate(date.getDate() + offset.end -1 )
  return `${formatDate(prev)} - ${formatDate(next)}`
}

const getDateRangeForWeekXs = (date) => {

  let offset = GetWeekOffsetRange(date)

  if (5 > offset.end && offset.end > 1) { // HACK
    offset.start += 3     // .getDay() returns an int between 0 and 6
    offset.end += 3       // it's not ideal to assume that a piece
  } else if (offset.end === 1) {   // of UI will be between 0 and 6
    offset.start += 6
    offset.end += 6
  }

  let prev = new Date(date.getTime())
  prev.setDate(date.getDate() + offset.start)
  let next = new Date(date.getTime())
  next.setDate(date.getDate() + offset.end -5 )
  return `${formatDate(prev)} - ${formatDate(next)}`
}

const formatDate = (date) => `${MonthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

class Scoreboard extends Component {

  render() {
    const {classes, scoreData, date, onUpdateDate, activeLeague} = this.props
    const scoreCards = scoreData.map((x,i) => <ScoreCard key={i} useRightSide={false} scoreboardData={x} activeLeague={activeLeague}/>)

    return (
      <div className={classes.container}>
        <Typography
          className={classes.title}
          variant="display1"
          children="Scores"
        />
        <Typography
          className={classes.caption}
          variant="caption"
          gutterBottom
          children={getDateRangeForWeek(date)}
        />
        <Typography
          className={classes.captionXs}
          variant="caption"
          gutterBottom
          children={getDateRangeForWeekXs(date)}
        />
        <DayPicker
          date={date}
          onUpdateDate={onUpdateDate}
        />
        <br/>
        <Typography
          className={classes.body1}
          variant="body1"
          children={`Scores for ${formatDate(date)}`}
          paragraph={true}
        />
        <div style={{display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
          {scoreCards}
        </div>

      </div>
    )
  }
}

export default R.compose(
  withStyles(styles),
  connect(R.pick(['teams'])),
)(Scoreboard)

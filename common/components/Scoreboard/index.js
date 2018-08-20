const R = require('ramda')
import {Component} from 'react'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DayPicker from './DayPicker'
import ScoreCard from './ScoreCard'
import {MonthNames, GetWeekOffsetRange } from '../../lib/time'

const styles = (theme) => ({
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

const formatDate = (date) => `${MonthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

class Scoreboard extends Component {

  render() {
    const {classes, scoreData, date, onUpdateDate} = this.props
    const scoreCards = scoreData.map((x,i) => <ScoreCard key={i} useRightSide={false} scoreboardData={x}/>)
 
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
          {scoreCards.map(x => x)}
        </div>

      </div>
    )
  }
}

export default R.compose(
  withStyles(styles),
  connect(R.pick(['teams'])),
)(Scoreboard)
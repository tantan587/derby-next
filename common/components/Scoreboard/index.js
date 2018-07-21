const R = require('ramda')
import {Component} from 'react'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DayPicker from './DayPicker'
import ScoreCard from './ScoreCard'
import {MonthNames } from '../../lib/time'

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

const getCompleteDate = (date) => {
  let prev = new Date(date.getTime())
  prev.setDate(date.getDate() - 3)
  let next = new Date(date.getTime())
  next.setDate(date.getDate() + 3)
  return `${formatDate(prev)} - ${formatDate(next)}`
}

const formatDate = (date) => `${MonthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

class Scoreboard extends Component {

  state = {date : new Date()}


  onUpdateDate =  (date) => {
    this.setState({date})
  }

  render() {
    const {classes, scoreData} = this.props
    const {date} = this.state
    const scoreCards = scoreData.map(x => <ScoreCard useRightSide={false} scoreboardData={x}/>)
 
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
          children={getCompleteDate(new Date())}
        />
        <DayPicker
          date={date}
          onUpdateDate={this.onUpdateDate}
        />
        <br/>
        <Typography
          className={classes.body1}
          variant="body1"
          children={`Scores for ${formatDate(new Date())}`}
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
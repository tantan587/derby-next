const R = require('ramda')
import {Component} from 'react'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DayPicker from './DayPicker'
import ScoreCard from './ScoreCard'
import {MonthNames } from '../../lib/time'

const scoreboardDataLive = {
  status : 'Top 8th',
  header : ['R','H','E'],
  home : {
    team_name: 'Boston Redsox',
    url: 'https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg',
    record: '33-25, 87 Points',
    score:[4,7,1]
  },
  away : {
    team_name: 'Atlanta Braves',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg',
    record: '23-35, 36 Points',
    score:[2,3,1]
  },
  stadium: 'Fenway Park'
}

const scoreboardDataFinal = {
  status : 'Final',
  header : ['R','H','E'],
  home : {
    team_name: 'Boston Redsox',
    url: 'https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg',
    record: '33-25, 87 Points',
    score:[6,8,1]
  },
  away : {
    team_name: 'Atlanta Braves',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg',
    record: '23-35, 36 Points',
    score:[3,5,1],
    lost:true
  },
  stadium: 'Fenway Park'
}

const scoreboardDataPreview = {
  status : '7:00 PM EST',
  header : ['R','H','E'],
  home : {
    team_name: 'Boston Redsox',
    url: 'https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg',
    record: '33-25, 87 Points',
    score:[0,0,0]
  },
  away : {
    team_name: 'Atlanta Braves',
    url: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg',
    record: '23-35, 36 Points',
    score:[0,0,0]
  },
  stadium: 'Fenway Park'
}




const styles = (theme) => (console.log(theme), {
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
    console.log('hello')
    this.setState({date})
  }

  render() {
    const {classes} = this.props
    const {date} = this.state
    const scoreCards = [<ScoreCard useRightSide={false} scoreboardData={scoreboardDataLive}/>,
      <ScoreCard useRightSide={false} scoreboardData={scoreboardDataPreview}/>,
      <ScoreCard useRightSide={false} scoreboardData={scoreboardDataFinal}/>,
      <ScoreCard useRightSide scoreboardData={scoreboardDataLive}/>]

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
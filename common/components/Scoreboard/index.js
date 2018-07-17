const R = require('ramda')
import {Component} from 'react'
import {connect} from 'react-redux'
import {DatePicker} from 'material-ui-pickers'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import MONTHS from './MONTHS'
import {LRRR} from './ScoreCardLayouts'
import WeekDayPicker from './WeekDayPicker'
import TeamCard from './TeamCard'
import MetaPB from './MetaPB'

const FIXTURES = {
  away_team: 'Atlanta Hawks',
  home_team: 'Boston Celtics',
  away_url: 'https://upload.wikimedia.org/wikipedia/en/2/24/Atlanta_Hawks_logo.svg',
  home_url: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg',
  away_record: '28-30',
  home_record: '33-25',
  inning:'Top 8',
  away_runs:0,
  home_runs:4,
  away_hits:4,
  home_hits:4,
  away_errors:0,
  home_errors:0,
  stadium:'Washington Field',
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

const formatDate = (date) => `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

const ScoreCard = withStyles((theme) => ({
  container: {
    maxWidth: 600,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  left: {
    [theme.breakpoints.between('xs', 'sm')]: {
      borderBottom: `1px solid ${theme.palette.grey.A200}`,
    },
    [theme.breakpoints.up('md')]: {
      borderRight: `1px solid ${theme.palette.grey.A200}`,
    },
  },
  venue: {
    marginBottom: 10,
    marginLeft: 10,
  },
  right: {
    padding: '25px',
  },
  bb: {
    borderBottom: '1px solid #777'
  },
  Header: {marginBottom: 30, borderBottom: `1px solid ${theme.palette.grey.A200}`, padding: '10px 10px 10px 10px'},
  Row: {marginBottom: 30, padding: '0 10px'},
  R: {color: '#555'},
  RContent: {justifyContent: 'center'}
}))(({
  classes,
}) => (
  <Grid
    container
    className={classes.container}
    xs={12}
    direction="row"
    component={Paper}
  > 
    <Grid
      className={classes.left}
      item
      container
      xs={12}
      md={7}
    >
      <LRRR
        className={classes.Header}
        classes={R.pick(['R', 'RContent'], classes)}
        L={<Typography children={<b>Top 8th</b>} variant="subheading" color="primary"/>}
        R={[<Typography children="R" variant="caption" />,
          <Typography children="H" variant="caption" />,
          <Typography children="E" variant="caption" />]}
      />
      <LRRR
        className={classes.Row}
        classes={R.pick(['R', 'RContent'], classes)}
        L={(
          <TeamCard
            team_name={FIXTURES.away_team}
            logo_url={FIXTURES.away_url}
          />
        )}
        R={[<Typography children={FIXTURES.away_runs} variant="subheading" color="inherit" />,
          <Typography children={FIXTURES.away_hits} variant="subheading" color="inherit" />,
          <Typography children={FIXTURES.away_errors} variant="subheading" color="inherit" />]}
      />
      <LRRR
        className={classes.Row}
        classes={R.pick(['R', 'RContent'], classes)}
        L={(
          <TeamCard
            team_name={FIXTURES.home_team}
            logo_url={FIXTURES.home_url}
          />
        )}
        R={[<Typography children={FIXTURES.home_runs} variant="subheading" color="inherit" />,
          <Typography children={FIXTURES.home_hits} variant="subheading" color="inherit" />,
          <Typography children={FIXTURES.home_errors} variant="subheading" color="inherit" />]}
      />
      <Typography className={classes.venue} variant="caption"><b>Location</b>: AT&T Stadium</Typography>
    </Grid>
    <Grid
      item
      className={classes.right}
      xs={12}
      md={5}
      children={(
        <MetaPB />
      )}
    />
  </Grid>
))

class Scoreboard extends Component {

  state = {date : new Date()}


  onUpdateDate =  (date) => {
    console.log('hello')
    this.setState({date})
  }

  render() {
    const {classes, teams} = this.props
    const {date} = this.state
    return (
      <div className={classes.container}>
        <Typography
          className={classes.title}
          variant="display1"
          children="MLB Scores"
        />
        <Typography
          className={classes.caption}
          variant="caption"
          gutterBottom
          children={getCompleteDate(new Date())}
        />
        <WeekDayPicker
          date={date}
          onUpdateDate={this.onUpdateDate}
        />
        <DatePicker
          keyboard
          label="Or pick a date"
          format="MM/DD/YYYY"
          value={date}
          onChange={this.onUpdateDate}
          animateYearScrolling={false}
        />
        <Typography
          className={classes.body1}
          variant="body1"
          children={`Scores for ${formatDate(new Date())}`}
          paragraph={true}
        />
        <ScoreCard />
        <ScoreCard />
      </div>
    )
  }
}

export default R.compose(
  withStyles(styles),
  connect(R.pick(['teams'])),
)(Scoreboard)
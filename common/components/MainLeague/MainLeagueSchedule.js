import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import OneSchedule from './OneSchedule'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import {MenuItem} from 'material-ui/Menu'
import { connect } from 'react-redux'
import Typography from 'material-ui/Typography'
import {clickedDateChange} from '../../actions/sport-actions'


const styles = theme => ({
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
  },
  textField: {
    marginLeft: 40,//theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    float: 'left'
  },
  menu: {
    width: 200,
  },
  title : {
    textAlign : 'center'
  },
  tableWrapper: {
   
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
})

class MainLeagueSchedule extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      owner: '',
      sport: '',
      day: new Date().toJSON().slice(0,10),
      goodDay: new Date().toJSON().slice(0,10),
    }
  }


  handleUpdateOwner = () => event => {
    this.setState({
      owner: event.target.value
    })
  }

  handleUpdateSport = () => event => {
    this.setState({
      sport: event.target.value
    })
  }

  handleUpdateDay = () => event => {
    const newValue = event.target.value
    if (newValue !== '')
    {
      const { onDateChange, activeLeague } = this.props
      this.setState({
        goodDay: newValue
      })
      onDateChange(activeLeague.league_id, newValue)
    }
    this.setState({
      day: newValue
    })
  }

  render() {
    const { classes, sportLeagues, activeLeague, teams, schedule} = this.props
    const {day, goodDay} = this.state
    const myOwnerName = activeLeague.owners.filter(x => x.owner_id === this.props.activeLeague.owners[0].owner_id)[0].owner_name
    const sportLeaguesArr = Array.from(sportLeagues)
    const ownersArr = Array.from(activeLeague.owners)
    sportLeaguesArr.unshift({sport:'All'})
    ownersArr.unshift({owner_name:'All'})

    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    var split = goodDay.split('-')
    var d = new Date(split[0],split[1]-1,split[2])

    var dateStr = weekdays[d.getDay()] + ', ' + monthNames[d.getMonth()] + ' ' + (d.getDate()) + ', ' + d.getFullYear()

    var schedules = []
    schedule.map(x => {
      const homeTeam = teams.filter(team => team.team_id === x.home_team_id)[0]
      const awayTeam = teams.filter(team => team.team_id === x.away_team_id)[0]
      schedules.push({homeTeam:homeTeam.team_name, awayTeam:awayTeam.team_name, sport:homeTeam.sport})
    })

    return(<Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <br/>
        <Typography className={classes.title} type="display1">Schedule</Typography>
        <br/>
        <div style={{left:'50%', position:'relative', marginLeft:-150}}>
          <TextField
            id={'select-owner'}
            select
            label="Select Owner"
            className={classes.textField}
            value={this.state.owner}
            onChange={this.handleUpdateOwner()}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            //helperText="Please select your currency"
            margin="normal"
          >
            {ownersArr.map(option => (
              <MenuItem key={option.owner_name} value={option.owner_name}>
                {option.owner_name === myOwnerName ? 'Me' : option.owner_name}
              </MenuItem>
            ))}
          </TextField>
          <br style={{clear: 'both'}}/>
          <TextField
            id={'select-sport'}
            select
            label="Select Sport"
            className={classes.textField}
            value={this.state.sport}
            onChange={this.handleUpdateSport()}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            //helperText="Please select your currency"
            margin="normal"
          >
            {sportLeaguesArr.map(option => (
              <MenuItem key={option.sport} value={option.sport}>
                {option.sport}
              </MenuItem>
            ))}
          </TextField>
          <br style={{clear: 'both'}}/>
          <TextField
            id="date"
            label="Day"
            type="date"
            value={day}
            onChange={this.handleUpdateDay()}
            className={classes.textField}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"
          />
        </div>
      </div>
      <br style={{clear: 'both'}}/>
      <br/>
      <Typography className={classes.title} type="headline">{dateStr}</Typography>
      <br/>(
      {schedules.map((x,i) =>
        <OneSchedule sport={x.sport} homeTeam={x.homeTeam} awayTeam={x.awayTeam} key={i} />
      )}
    </Paper>
    )
  }
}

MainLeagueSchedule.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      activeLeague : state.activeLeague,
      teams: state.teams,
      sportLeagues : state.sportLeagues,
      schedule : state.schedule,
    }),
  dispatch =>
    ({
      onDateChange(league_id, date) {
        dispatch(
          clickedDateChange(league_id, date))
      }
    })
)(withStyles(styles)(MainLeagueSchedule))





import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import {MenuItem} from 'material-ui/Menu'
import { connect } from 'react-redux'
import Typography from 'material-ui/Typography'

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
    overflowX: 'auto',
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
      day: 'unknown',
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
    console.log(event.target.value)
    this.setState({
      day: event.target.value
    })
  }

  render() {
    const { classes, sportLeagues, activeLeague} = this.props
    const {day} = this.state
    const myOwnerName = activeLeague.owners.filter(x => x.owner_id === this.props.activeLeague.owners[0].owner_id)[0].owner_name
    const sportLeaguesArr = Array.from(sportLeagues)
    const ownersArr = Array.from(activeLeague.owners)
    sportLeaguesArr.unshift({sport:'All'})
    ownersArr.unshift({owner_name:'All'})
    const dayToDisplay = day === 'unknown' ? new Date().toJSON().slice(0,10) : day

    return(<Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <br/>
        <Typography className={classes.title} type="display1">Schedule</Typography>
        <br/>
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
        <TextField
          id="date"
          label="Day"
          type="date"
          value={dayToDisplay}
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
    }),
  null
)(withStyles(styles)(MainLeagueSchedule))



import React from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Menu, { MenuItem } from 'material-ui/Menu'
import {clickedDateChange} from '../../actions/sport-actions'

import { connect } from 'react-redux'

const styles = {
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
  }
}

const commishOptions = ['Edit Draft Day', 'Add Offline Draft', 'Edit Rosters']

class MainLeaguePage extends React.Component {
  state = {
    commishOpen:false,
    commishAnchorEl:null
  };

  handleChange = (event, value) => {
    const { onDateChange, activeLeague } = this.props
    switch (value){
    case 0:
      Router.push('/mainleaguestandings')
      break
    case 1:
      Router.push('/mainleagueschedule')
      onDateChange(activeLeague.league_id, new Date(new Date().toString().slice(4,15)).toJSON().slice(0,10))
      break
    case 2:
      Router.push('/mainleagueroster')
      break
    case 3:
      Router.push('/mainleagueteams')
    }
  }

  handleCommishClick = event => {
    this.setState({ commishOpen: true, commishAnchorEl: event.currentTarget })
  };

  handleCommishMenuItemClick = (event, subIndex) => {
    switch (subIndex){
    case 1:
      Router.push('/add-draft')
    }
  };

  handleCommishClose = () => {
    this.setState({ commishOpen: false })
  };

  render() {
    const { classes, value } = this.props
    let myTeams = []
    this.props.teams.map(team => myTeams.push({
      ...team,
      record:team.wins + '-' + team.losses + '-' + team.ties,
      percentage: (team.wins + team.ties + team.losses) === 0 ? 0.0.toFixed(3) :  ((team.wins + 1/2*team.ties) / (team.wins + team.ties + team.losses)).toFixed(3)
    }))

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            scrollable
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Standings" />
            <Tab label="Schedules" />
            <Tab label="Rosters" />
            <Tab label="All Teams"/>
            <Tab label="Message Board" />
            <Tab label="League Settings" />
            <Tab label="Draft Recap" />
            {1 === 1 ? <Tab label="Commish Tools"
              aria-owns={this.state.commishOpen ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleCommishClick}/>: <div></div>}
          </Tabs>
        </AppBar>
        <Menu
          id="simple-menu"
          anchorEl={this.state.commishAnchorEl}
          open={this.state.commishOpen}
          onClose={this.handleCommishClose}
        >
          {commishOptions.map((option, index) => (
            <MenuItem
              key={option}
              //disabled={index === 0}
              //selected={index === subIndex}
              onClick={event => this.handleCommishMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>))}
        </Menu>
      </div>

    )
  }
}

MainLeaguePage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      activeLeague : state.activeLeague,
      user: state.user,
      teams: state.teams,
      sportLeagues : state.sportLeagues
    }),
  dispatch =>
    ({
      onDateChange(league_id, date) {
        dispatch(
          clickedDateChange(league_id, date))
      }
    })
)(withStyles(styles)(MainLeaguePage))



import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import {clickedStandings} from '../actions/sport-actions'
import EnhancedTable from './EnhancedTable'

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

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

class MainLeaguePage extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleSportClick = () => {
    this.props.onStandings()
  }

  render() {
    // if(this.props.user.loggedIn === false){
    //   if (typeof document !== 'undefined'){
    //     Router.push('/login')
    //   }
    //   return(<div></div>)
    // }
    if(1 === 0)
    {return(<div></div>)}
    else{
      const { classes } = this.props
      const { value } = this.state

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
              <Tab label="My Roster" />
              <Tab label="Schedules" />
              <Tab label="All Teams" onClick={this.handleSportClick}/>
              <Tab label="Message Board" />
              <Tab label="Other Rosters"  />
              <Tab label="League Settings" />
              <Tab label="Draft Reacap" />
            </Tabs>
          </AppBar>
          {value === 0 && <EnhancedTable
            title='Standings'
            myRows={this.props.activeLeague.owners}
            myHeaders = {[
              {label: 'Rank', key: 'rank'},
              {label: 'Owner', key: 'owner_name'},
              {label: 'User', key: 'username'},
              {label: 'Points', key: 'total_points'}
            ]}/>}
          {value === 1 && <TabContainer>Item Two</TabContainer>}
          {value === 2 && <TabContainer>Item Three</TabContainer>}
          {value === 3 && <TabContainer>Item Four</TabContainer>}
          {value === 4 && <TabContainer>Item Five</TabContainer>}
          {value === 5 && <TabContainer>Item Six</TabContainer>}
          {value === 6 && <TabContainer>Item Seven</TabContainer>}
          {value === 7 && <TabContainer>Item Eight</TabContainer>}

        </div>
        
      )
    }
  }
}

MainLeaguePage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      activeLeague : state.activeLeague,
      user: state.user
    }),
  dispatch =>
    ({
      onStandings() {
        dispatch(
          clickedStandings())
      }
    }))(withStyles(styles)(MainLeaguePage))



import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import EnhancedTable from '../EnhancedTable'

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

class MainLeagueRoster extends React.Component {
  

  render() {
    
    let myTeams = []
    Object.values(this.props.teams).map(team => myTeams.push({
      ...team, 
      record:team.wins + '-' + team.losses + '-' + team.ties, 
      percentage: (team.wins + team.ties + team.losses) === 0 ? 0.0.toFixed(3) :  ((team.wins + 1/2*team.ties) / (team.wins + team.ties + team.losses)).toFixed(3)
    }))
    return(<EnhancedTable
      title='Roster'
      usePagination={false}
      myRows={myTeams}
      rosterTitle={true}
      owners={this.props.activeLeague.owners}
      myOwnerId={this.props.activeLeague.owners.filter(x => x.user_id === this.props.user.id)[0].owner_id}
      myHeaders = {[
        {label: 'Logo', key: 'logo_url', sortId:'team_name', imageInd:true},
        {label: 'Team Name', key: 'team_name'},
        {label: 'Sport League', key: 'sport'},
        {label: 'Conference', key: 'conference'},
        {label: 'Record', key: 'record', sortId:'percentage'},
        {label: 'Percentage', key: 'percentage'},
        {label: 'Points', key: 'points'}
      ]}/>)
  }
}

MainLeagueRoster.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user: state.user,
      activeLeague : state.activeLeague,
      teams: state.teams,
    }),
  null
)(withStyles(styles)(MainLeagueRoster))



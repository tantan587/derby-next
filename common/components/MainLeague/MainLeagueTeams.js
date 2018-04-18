import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import EnhancedTable from '../EnhancedTable'
import DerbyTableContainer from '../Table/DerbyTableContainer'

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

class MainLeagueTeams extends React.Component {
  

  render() {
    let myTeams = []
    Object.values(this.props.teams).map(team => myTeams.push({
      ...team, 
      record:team.wins + '-' + team.losses + '-' + team.ties, 
      percentage: (team.wins + team.ties + team.losses) === 0 ? 0.0.toFixed(3) :  ((team.wins + 1/2*team.ties) / (team.wins + team.ties + team.losses)).toFixed(3)
    }))
    return(
      <DerbyTableContainer
        title='All Teams'
        usePagination={true}
        myRows={myTeams}
        filters={[
          {type:'checkbox', 
            values :this.props.sportLeagues.map(x => x.sport),
            column:'sport'}]}
        myHeaders = {[
          {label: 'Logo', key: 'logo_url', sortId:'team_name'},
          {label: 'Team Name', key: 'team_name'},
          {label: 'Owner Name', key: 'owner_name'},
          {label: 'Sport League', key: 'sport'},
          {label: 'Conference', key: 'conference'},
          {label: 'Record', key: 'record', sortId:'percentage'},
          {label: 'Percentage', key: 'percentage'},
          {label: 'Points', key: 'points'}
        ]}/>
    )

    // <EnhancedTable
    //   title='Sports Standings'
    //   usePagination={true}
    //   checkboxColumn='sport'
    //   sportLeagues={this.props.sportLeagues}
    //   myRows={myTeams}
    //   myHeaders = {[
    //     {label: 'Logo', key: 'logo_url', sortId:'team_name'},
    //     {label: 'Team Name', key: 'team_name'},
    //     {label: 'Owner Name', key: 'owner_name'},
    //     {label: 'Sport League', key: 'sport'},
    //     {label: 'Conference', key: 'conference'},
    //     {label: 'Record', key: 'record', sortId:'percentage'},
    //     {label: 'Percentage', key: 'percentage'},
    //     {label: 'Points', key: 'points'}
    //   ]}/>)
  }
}

MainLeagueTeams.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      sportLeagues : state.sportLeagues,
      teams: state.teams,
    }),
  null
)(withStyles(styles)(MainLeagueTeams))



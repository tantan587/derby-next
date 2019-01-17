import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Title from '../Navigation/Title'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
import sportLeagues from '../../../data/sportLeagues.json'
import FilterCreator from '../Filters/FilterCreator'
import Filterer from '../Filters/Filterer'
import {clickedLeague} from '../../actions/fantasy-actions'
import {withRouter} from 'next/router'
const R = require('ramda')

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

  componentWillMount(){
    this.props.onClickedLeague(this.props.activeLeague.league_id, this.props.user.id)
  }

  render() {
    const page = 'roster'
    const {teams, activeLeague, contentFilter} = this.props
    const sportLeagueIds = R.keys(sportLeagues)
    const ownerIdToStart = this.props.router.query.a || activeLeague.my_owner_id
    let default_tab = activeLeague.owners.sort((a,b) => {
      return a.owner_name.toLowerCase() > b.owner_name.toLowerCase() ? 1 : -1 })
      .findIndex(owner => owner.owner_id === ownerIdToStart)


    let myTeams = Object.values(teams).filter(team => sportLeagueIds.includes(team.sport_id)).map(team =>
    {
      let owner = null
      if (activeLeague.teams[team.team_id])
        owner = activeLeague.owners.filter(owner => owner.owner_id === activeLeague.teams[team.team_id].owner_id)[0]
      let points = 0
      let projPoints = 0
      let rank = 999

      if (activeLeague.teams[team.team_id])
      {
        owner = activeLeague.owners.find(owner => owner.owner_id === activeLeague.teams[team.team_id].owner_id)
        points = activeLeague.teams[team.team_id].points
        projPoints = activeLeague.teams[team.team_id].proj_points
        rank = activeLeague.teams[team.team_id].ranking
      }
      return {
        ...team,
        points,
        projPoints,
        rank,
        record:team.wins + '-' + team.losses + '-' + team.ties,
        percentage: (team.wins + team.ties + team.losses) === 0 ? 0.0.toFixed(3) : ((team.wins + 1/2*team.ties) / (team.wins + team.ties + team.losses)).toFixed(3),
        owner_name: owner ? owner.owner_name : 'N/A',
        //points:activeLeague.teams[team.team_id].points
      }
    })
    let filteredMyTeams = myTeams
    R.values(contentFilter[page]).forEach(filter => {
      filteredMyTeams = Filterer(filteredMyTeams, filter)
    })
    const filters = [{
      type:'tab',
      values: this.props.activeLeague.owners.map(x => x.owner_name).sort((a,b) => {
        return a.toLowerCase() > b.toLowerCase() ? 1 : -1
      }),
      column:'owner_name',
      defaultTab: default_tab, //this.props.activeLeague.owners.sort((a,b) => {return a.owner_name - b.owner_name}).findIndex(owner => owner.owner_id === activeLeague.my_owner_id),
      tabStyles:{backgroundColor:'#e3dac9',
        color:'#48311A',
        selectedBackgroundColor:'white',
        selectedColor:'#229246',
        fontSize:12}
    }]

    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title='Rosters'/>
        <TeamsDialog />
        <FilterCreator page={page} filters={filters}/>
        <DerbyTableContainer
          usePagination={true}
          myRows={filteredMyTeams}
          //orderInd={true}
          myHeaders = {[
            {label: 'Logo', key: 'logo_url', sortId:'team_name', imageInd:true},
            {label: 'Team Name', key: 'team_name'},
            {label: 'Sport', key: 'sport_id', imageInd:true},
            {label: 'Conference', key: 'conference'},
            {label: 'Record', key: 'record', sortId:'percentage'},
            {label: 'Derby Points', key: 'points'},
            {label: 'Proj. Points ', key: 'projPoints'},
            {label: 'Rank', key: 'rank'},
          ]}/>
      </div>
    )
  }
}

MainLeagueRoster.propTypes = {
  classes: PropTypes.object.isRequired,
}

// const mapDispatchToProps = () => ({
//   onClickedLeague:clickedLeague
// })

// export default connect(
//   state => ({
//     contentFilter: state.contentFilter,
//     teams: state.teams,
//     user:state.user,
//     activeLeague : state.activeLeague
//   }),
//   mapDispatchToProps,
// )(withStyles(styles)(MainLeagueRoster))

export default R.compose(
  withRouter,
  connect(R.pick(['activeLeague', 'user', 'contentFilter', 'teams']), {onClickedLeague: clickedLeague})
)(withStyles(styles)(MainLeagueRoster))

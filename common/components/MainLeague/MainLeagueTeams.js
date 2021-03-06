import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {withRouter} from 'next/router'
import Title from '../Navigation/Title'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
import sportLeagues from '../../../data/sportLeagues.json'
import FilterCreator from '../Filters/FilterCreator'
import Filterer from '../Filters/Filterer'
import {clickedLeague} from '../../actions/fantasy-actions'
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

class MainLeagueTeams extends React.Component {

  componentWillMount(){
    this.props.onClickedLeague(this.props.activeLeague.league_id, this.props.user.id)
  }


  render() {
    const page = 'teams'
    const {teams, activeLeague, contentFilter, router} = this.props
    const sportLeagueIds = R.keys(sportLeagues)
    let myTeams = Object.values(teams).filter(team => sportLeagueIds.includes(team.sport_id) && team.eligible).map(team =>
    {
      let owner = null
      let points = 0
      let projPoints = 0
      let rank = 999
      if (activeLeague.teams[team.team_id]) {
        owner = activeLeague.owners.find(owner => owner.owner_id === activeLeague.teams[team.team_id].owner_id)
        points = activeLeague.teams[team.team_id].points
        projPoints = activeLeague.teams[team.team_id].proj_points
        rank = activeLeague.teams[team.team_id].ranking
      }

      return {
        ...team,
        record:team.wins + '-' + team.losses + '-' + team.ties,
        percentage: (team.wins + team.ties + team.losses) === 0 ? 0.0.toFixed(3) : ((team.wins + 1/2*team.ties) / (team.wins + team.ties + team.losses)).toFixed(3),
        owner_name: owner ? owner.owner_name : 'N/A',
        points,
        pointsAndProj: points + ' (' + projPoints + ')',
        projPoints,
        rank
        //points:activeLeague.teams[team.team_id].points
      }
    })
    myTeams.sort((x, y) => { return x.rank > y.rank ? 1 : - 1 })
    myTeams.forEach((x, i) => {
      x.rank = i + 1
    })
    const values = R.map(x => x.sport_id, this.props.activeLeague.rules)
    values.unshift('All')
    values.push('My Teams')
    let ownerName = activeLeague.owners.find(x => x.owner_id === activeLeague.my_owner_id).owner_name
    let filteredMyTeams = myTeams
    let confs = [...new Set(filteredMyTeams.map(x => x.conference))].sort((a, b) => { return a > b })

    R.values(contentFilter[page]).forEach(filter => {
      filteredMyTeams = Filterer(filteredMyTeams, filter, { ownerName })
      if (filter.type === 'tab') {
        confs = [...new Set(filteredMyTeams.map(x => x.conference))].sort()
      }
    })

    confs.unshift('All')
    const { query } = router
    const { conf } = query

    const filters = [{
      type:'tab',
      displayType:'sportsIcon',
      values,
      defaultValue: conf,
      column:'sport_id',
      defaultTab:0,
      tabStyles: {
        backgroundColor:'#e3dac9',
        color:'#48311A',
        selectedBackgroundColor:'white',
        selectedColor:'#229246',
        fontSize:16
      }
    },
    {
      type:'dropdown',
      values:confs,
      defaultValue: conf,
      column:'conference',
      name:'Conference'
    },
    {
      type:'search',
      column:'team_name',
    }]

    return (
      <div>
        <TeamsDialog />
        <Title color='white' backgroundColor='#EBAB38' title='All Teams' />
        <FilterCreator filters={filters} page={page} />
        <DerbyTableContainer
          usePagination={true}
          noBreak={true}
          myRows={filteredMyTeams}
          //orderInd={true}
          myHeaders={[
            { label: 'Logo', key: 'logo_url', sortId: 'team_name', imageInd: true },
            { label: 'Team Name', key: 'team_name' },
            { label: 'Sport', key: 'sport_id', imageInd: true },
            { label: 'Conference', key: 'conference' },
            { label: 'Owner Name', key: 'owner_name' },
            { label: 'Record', key: 'record', sortId: 'percentage' },
            { label: 'Derby Points', key: 'points' },
            { label: 'Proj. Points ', key: 'projPoints' },
            { label: 'Rank', key: 'rank' },
            // {label: 'Points', key: 'points'}
          ]} />
      </div>
    )
  }
}

export default R.compose(
  withRouter,
  connect(R.pick(['activeLeague', 'user', 'contentFilter', 'teams']), {onClickedLeague: clickedLeague})
)(withStyles(styles)(MainLeagueTeams))

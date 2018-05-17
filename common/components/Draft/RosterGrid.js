import React from 'react'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import TeamsDialog from '../TeamsDialog/TeamsDialog'

class RosterGrid extends React.Component {
  
  render() {
    const { sportLeagues, draft, teams, activeLeague } = this.props
    const headers = [{label: 'Owner', key: 'owner_name'}]
    const nonStrictLeagueCount = {}
    sportLeagues.forEach(sport => {
      //we need to display it by conference
      if(sport.conf_strict && sport.num === sport.conferences.length)
      {
        sport.conferences.forEach(conf => headers.push( 
          {label: sport.sport + '-' + conf.conference, key: conf.conference_id, imageInd:true}))
      }
      else{
        let arr = Array.apply(null, {length: sport.num}).map(Number.call, Number)
        console.log(arr)
        arr.forEach(i => {
          headers.push( 
            {label: sport.sport + '-' + (i+1), key: sport.sport_id + '-'+(i+1),  imageInd:true})
          nonStrictLeagueCount[sport.sport_id] = 1
        }
        )
      }
    })

    const rows = []
    Object.keys(draft.owners).map(ownerId => {
      let row = {}
      row.owner_name = activeLeague.owners.filter(owner => owner.owner_id === ownerId)[0].owner_name
      draft.owners[ownerId].map(pick => {
        let team = teams[pick.teamId]
        let key = team.conference_id
        if(nonStrictLeagueCount[team.sport_id] > 0)
        {
          key = team.sport_id + '-'+ nonStrictLeagueCount[team.sport_id]
          nonStrictLeagueCount[team.sport_id]++
        }
        row[key] = team.logo_url
      })

      rows.push(row)
      Object.keys(nonStrictLeagueCount).map(x => {nonStrictLeagueCount[x] = 1})
    })
    console.log(rows, headers, nonStrictLeagueCount)

    return (
      <div>
        <TeamsDialog />
        <DerbyTableContainer
          passUpFilterInfo={this.passUpFilterInfo}
          usePagination={false}
          myRows={rows}
          myHeaders = {headers}/>
      </div>
    )
  }
}

export default connect(
  state =>
    ({
      draft : state.draft,
      teams:state.teams,
      activeLeague:state.activeLeague,
      sportLeagues:state.sportLeagues
    }),  null)(RosterGrid)
import React from 'react'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import TeamsDialog from '../TeamsDialog/TeamsDialog'

const styleProps = {
  Container:{
    overflowY:'scroll',
    maxHeight:600
  },
  Header: {
    TableCell: {
      borderLeft: '0.1em solid #b2b2b2',
      borderRight: '0.1em solid #b2b2b2'
    }
  },
  Body: {
    striped:'#e3dac9',
    TableBody: {
      //backgroundColor: 'green'
    },
    TableCell: (i) => ({
      width: i === 0 ? 100: 40,
      color: 'black',
      borderLeft: '0.1em solid #b2b2b2',
      borderRight: '0.1em solid #b2b2b2'
    }),
  }
}


class RosterGrid extends React.Component {
  
  render() {
    const {  draft, teams, activeLeague } = this.props
    const headers = [{label: 'Owner', key: 'owner_name'}]
    const nonStrictLeagueCount = {}
    activeLeague.rules.forEach(sport => {
      //we need to display it by conference
      if(sport.conf_strict && sport.num === sport.conferences.length)
      {
        sport.conferences.forEach(conf => headers.push( 
          {label: sport.sport + '-' + conf.conference, key: conf.conference_id, imageInd:true, disableSort:true}))
      }
      else{
        let arr = Array.apply(null, {length: sport.num}).map(Number.call, Number)
        arr.forEach(i => {
          headers.push( 
            {label: sport.sport + '-' + (i+1), key: sport.sport_id + '-'+(i+1),  imageInd:true,disableSort:true})
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
        row[key] = {}
        row[key].url = team.logo_url
        row[key].team_id = team.team_id
      })

      rows.push(row)
      Object.keys(nonStrictLeagueCount).map(x => {nonStrictLeagueCount[x] = 1})
    })
    console.log(1, rows)
    return (
      <div style={{height:730, minHeight:730, maxHeight:730}}>
        <TeamsDialog/>
        <DerbyTableContainer
          passUpFilterInfo={this.passUpFilterInfo}
          usePagination={false}
          myRows={rows}
          myHeaders = {headers}
          styleProps={styleProps}/>
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
    }),  null)(RosterGrid)
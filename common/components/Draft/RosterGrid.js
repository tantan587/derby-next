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
  
  navigateToSport = (key) => {
    let dict = {}
    this.props.activeLeague.rules.forEach(sport => {
      sport.conferences.forEach(conf => {
        dict[conf.conference_id] = conf.conference
      })
    })

    if(key.includes('-'))
      this.props.navigateToSport(key.substring(0,3), -1)
    else
      this.props.navigateToSport(key.substring(0,3), dict[key])
  }
  render() {
    const {  draft, teams, activeLeague } = this.props
    const headers = [{label: 'Owner', key: 'owner_name'}]
    const nonStrictLeagueCount = {}
    activeLeague.rules.forEach(sport => {
      //we need to display it by conference
      if(sport.conf_strict && sport.num === sport.conferences.length)
      {
        //let first_label = ['101', '104', '107'].includes(sport.sport_id) ? '' : sport.sport + '-'
        sport.conferences.forEach(conf => headers.push( 
          {label: sport.sport  + (['101', '104'].includes(sport.sport_id) ? 
            ('-' + conf.conference[4]) : ['107'].includes(sport.sport_id) ? '' :('-' + conf.conference[0])), key: conf.conference_id, imageInd:true, disableSort:true,
          onClick:this.navigateToSport, toolTip:'Navigate'}))
      }
      else{
        let arr = Array.apply(null, {length: sport.num}).map(Number.call, Number)
        arr.forEach(i => {
          headers.push( 
            {label: sport.sport + '-' + (i+1), key: sport.sport_id + '-'+(i+1),  imageInd:true,disableSort:true,
              onClick:this.navigateToSport, toolTip:'Navigate'})
          nonStrictLeagueCount[sport.sport_id] = 1
        }
        )
      }
    })

    let owner_draft_picks = {}
    Object.keys(draft.owners).forEach(ownerId =>{
      let owner = activeLeague.owners.find(owner => owner.owner_id === ownerId)
      owner_draft_picks[ownerId] = owner ? owner.draft_position : -1
    })

     
    
    const rows = []
    Object.keys(draft.owners).sort(function(a,b){
      return owner_draft_picks[a] - owner_draft_picks[b]}).map(ownerId => {
      
      let row = {}
      let owner = activeLeague.owners.find(owner => owner.owner_id === ownerId)
      row.owner_name = owner ? owner.owner_name : ''
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
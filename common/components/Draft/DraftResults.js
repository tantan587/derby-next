import React from 'react'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import TeamsDialog from '../TeamsDialog/TeamsDialog'

const styleProps = {
  Container:{
    overflowY:'scroll',
    maxHeight:600
},
}

class DraftResults extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      teamIdsHold : [],
      teamIdsToUse : []
    }
  }


  render() {
    const {draft, teams, activeLeague } = this.props

    const owners = activeLeague.owners
    const ownerDraftOrder = []
    owners.map(x => ownerDraftOrder[x.draft_position]  = x)

    const pickToTeamInfo = draft.draftedTeams.map(teamId => teams[teamId])


    const draftResults = activeLeague.draftOrder.map((x,i) => {
      let rtnObj = {...ownerDraftOrder[x.ownerIndex],
        pick:x.pick % owners.length +1,
        round:Math.floor(x.pick /owners.length) + 1,
        overallPick:(x.pick+1)}
      if(i < pickToTeamInfo.length)
      {
        console.log(rtnObj, pickToTeamInfo[i])
        rtnObj = {...pickToTeamInfo[i],...rtnObj,}
        console.log(rtnObj)
      }
      return rtnObj
    })

    console.log(draftResults)

    let extraTableRow = {}
    extraTableRow.freq = 8
    extraTableRow.message = 'Round '
    extraTableRow.key = 'round'
    
    return (
      <div style={{height:730, minHeight:730, maxHeight:730}}>
        <TeamsDialog />
        <DerbyTableContainer
          usePagination={true}
          myRows={draftResults}
          extraTableRow={extraTableRow}
          styleProps={styleProps}
          myHeaders = {[
            {label: 'Pick', key: 'overallPick'},
            {label: 'Owner Name', key: 'owner_name'},
            {key: 'logo_url', sortId:'team_name', imageInd:true},
            {label: 'Team Name', key: 'team_name'},
            {label: 'Conference', key: 'conference'},
            {label: 'Sport League', key: 'sport'},
            {label: 'Record', key: 'record', sortId:'percentage'},
            {label: 'Percentage', key: 'percentage'},
            {label: 'Points', key: 'points'}
          ]}/>
      </div>
    )
  }
}


export default connect(
  state =>
    ({
      draft : state.draft,
      teams:state.teams,
      activeLeague:state.activeLeague
    }),
  null)(DraftResults)
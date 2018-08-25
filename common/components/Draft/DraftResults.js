import React from 'react'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
import FilterCreator from '../Filters/FilterCreator'
import Filterer from '../Filters/Filterer'
const R = require('ramda')

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
    const {draft, teams, activeLeague, contentFilter } = this.props
    const page= 'draft-results'
    const owners = activeLeague.owners
    const ownerDraftOrder = []
    owners.map(x => ownerDraftOrder[x.draft_position]  = x)

    const pickToTeamInfo = draft.draftedTeams.map(teamId => teams[teamId])


    let draftResults = activeLeague.draftOrder.map((x,i) => {
      let rtnObj = {...ownerDraftOrder[x.ownerIndex],
        pick:x.pick % owners.length +1,
        round:Math.floor(x.pick /owners.length) + 1,
        overallPick:(x.pick+1)}
      if(i < pickToTeamInfo.length)
      {
        rtnObj = {...pickToTeamInfo[i],...rtnObj,}
      }
      return rtnObj
    })

    let extraTableRow = {}
    extraTableRow.freq = activeLeague.owners.length
    extraTableRow.message = 'Round '
    extraTableRow.key = 'round'

    let rounds = [...new Set(draftResults.map(x => x.round))]
    let filters = [{type:'dropdown',
      values:rounds,
      column:'round',
      name:'Round',
      displayFunction:(x) => 'Round ' + x
    }]

    R.values(contentFilter[page]).forEach(filter => {
      draftResults = Filterer(draftResults, filter)
    })

    return (
      <div style={{ height: 730, minHeight: 730, maxHeight: 730 }}>
        <TeamsDialog />
        <FilterCreator page={page} filters={filters} />
        <DerbyTableContainer
          usePagination={true}
          myRows={draftResults}
          extraTableRow={extraTableRow}
          styleProps={styleProps}
          // disableSort={true}

          myHeaders={[
            { label: 'Pick', key: 'overallPick', disableSort: true },
            { label: 'Owner Name', key: 'owner_name', disableSort: true },
            { key: 'logo_url', sortId: 'team_name', imageInd: true, disableSort: true },
            { label: 'Team Name', key: 'team_name', disableSort: true },
            { label: 'Conference', key: 'conference', disableSort: true },
            { label: 'Sport League', key: 'sport', disableSort: true },
            { label: 'Record', key: 'record', sortId: 'percentage', disableSort: true },
            { label: 'Percentage', key: 'percentage', disableSort: true },
            { label: 'Points', key: 'points', disableSort: true }
          ]} />
      </div>
    )
  }
}


export default connect(
  state =>
    ({
      contentFilter:state.contentFilter,
      draft : state.draft,
      teams:state.teams,
      activeLeague:state.activeLeague
    }),
  null)(DraftResults)
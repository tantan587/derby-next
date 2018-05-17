import React from 'react'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
import {handleFilterTab} from '../../actions/draft-actions'


class Roster extends React.Component {
  
  componentWillMount() {
    this.props.onFilterTab({}) 
  }

  passUpFilterInfo = (filterInfo) =>
  {
    
    const newFilterInfo = this.props.draft.filterInfo
    newFilterInfo[filterInfo.type] = {'key':filterInfo.key, 'value': filterInfo.value}
    
    this.props.onFilterTab(newFilterInfo) 
  }

  render() {
    const {  draft,teams, activeLeague } = this.props
    let ownerId 
    let draftedTeams = []

    if (draft.filterInfo['tab'] && draft.filterInfo['tab'].value)
    {
      const owner = activeLeague.owners.filter(x => x['owner_name'] === draft.filterInfo['tab'].value)
      
      if (owner[0])
      {
        ownerId = owner[0].owner_id
        draftedTeams = draft.owners[ownerId].map((x,i) => {
          return {pick:(i+1)+' ('+(x.pick+1)+')', ...teams[x.teamId]}
        })
      }
    }

    return (
      <div>
        <TeamsDialog />
        <DerbyTableContainer
          passUpFilterInfo={this.passUpFilterInfo}
          usePagination={true}
          myRows={draftedTeams}
          filters={[
            {type:'tab', 
              values :this.props.activeLeague.owners.map(x => x.owner_name),
              column:'owner_name',
              tabStyles:{background:'#E2E2E2', foreground:'white', text:'#229246', fontSize:10}
            },
          ]}
          myHeaders = {[
            {label: 'Pick', key: 'pick'},
            {key: 'logo_url', sortId:'team_name', imageInd:true},
            {key: 'team_name', sortId:'team_name'},
            {label: 'Sport League', key: 'sport'},
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
    }),  dispatch =>
    ({onFilterTab(filterInfo) {
      dispatch(
        handleFilterTab(filterInfo))
    },}))(Roster)
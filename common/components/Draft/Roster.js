import React from 'react'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
import {handleFilterTab} from '../../actions/draft-actions'
import FilterCreator from '../Filters/FilterCreator'

const styleProps = {
  Container:{
    overflowY:'scroll',
    maxHeight:600
  },
}

class Roster extends React.Component {
  
  componentWillMount() {
    this.props.onFilterTab({}) 
  }
  render() {
    const page = 'draft-roster'
    const {  draft,teams, activeLeague, contentFilter } = this.props
    let ownerId
    let default_tab = activeLeague.owners.find(x => {return x.owner_id === activeLeague.my_owner_id}).draft_position
    console.log(default_tab)
    let draftedTeams = []

    if (contentFilter[page] )
    {
      const owner = activeLeague.owners.filter(x => x['owner_name'] === contentFilter[page][0].value)

      if (owner[0])
      {
        ownerId = owner[0].owner_id
        draftedTeams = draft.owners[ownerId].map((x,i) => {
          return {pick:(i+1)+' ('+(x.pick+1)+')', ...teams[x.teamId]}
        })
      }
    }


    const filters = [{
      type:'tab',
      values : this.props.activeLeague.owners.sort((a,b)=> {return a.draft_position - b.draft_position}).map(x =>  x.owner_name),
      column:'owner_name',
      defaultTab: default_tab,
      tabStyles:{backgroundColor:'#e3dac9',
        color:'#48311A',
        selectedBackgroundColor:'white', 
        selectedColor:'#229246',
        fontSize:10}
    }]

    return (
      <div style={{height:730, minHeight:730, maxHeight:730}}>
        <TeamsDialog />
        <FilterCreator page={page} filters={filters}/>
        <DerbyTableContainer
          passUpFilterInfo={this.passUpFilterInfo}
          usePagination={true}
          myRows={draftedTeams}
          styleProps={styleProps}
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
      contentFilter:state.contentFilter,
      draft : state.draft,
      teams:state.teams,
      activeLeague:state.activeLeague
    }),  dispatch =>
    ({onFilterTab(filterInfo) {
      dispatch(
        handleFilterTab(filterInfo))
    },}))(Roster)
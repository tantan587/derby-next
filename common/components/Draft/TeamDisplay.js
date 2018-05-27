import React from 'react'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import {handleFilterTab} from '../../actions/draft-actions'
import TeamsDialog from '../TeamsDialog/TeamsDialog'

class TeamDisplay extends React.Component {
  addItem = (team) =>
  {
    this.props.onAddQueue(team)
  }

  removeItem = (item) =>
  {
    const result = Array.from(this.props.draft.queue)
    const index = result.indexOf(item)
    result.splice(index, 1)
    this.props.onUpdateQueue(result)
  }

  draftTeam = (team) =>
  {
    this.props.onDraftButton(team)
  }

  componentWillMount() {
    this.props.onFilterTab({})
  }

  passUpFilterInfo = (filterInfo) =>
  {

    const newFilterInfo = this.props.draft.filterInfo
    newFilterInfo[filterInfo.type] = {'key':filterInfo.key, 'value': filterInfo.value}

    if (filterInfo.type === 'tab')
      newFilterInfo['dropdown'] = null

    this.props.onFilterTab(newFilterInfo)
  }

  render() {
    const {  draft,teams, allowDraft} = this.props
    const availableTeams = draft.availableTeams
    const queue = draft.queue
    let teamsToShow = []
    availableTeams.map(teamId => {
      if(!draft.eligibleTeams.includes(teamId))
        teamsToShow.push({...teams[teamId],disableQueue:true, labelOverride:'Not eligible' })
      else if(queue.indexOf(teamId) === -1)
        teamsToShow.push(teams[teamId])
      else
        teamsToShow.push({...teams[teamId], labelOverride:'Remove',onClickOverride:this.removeItem })
    })
    if (draft.filterInfo['tab'])
      teamsToShow = draft.filterInfo['tab'].value ?
        teamsToShow = teamsToShow.filter(x => x[draft.filterInfo['tab'].key] === draft.filterInfo['tab'].value) :
        teamsToShow

    const confs = [...new Set(teamsToShow.map(x => x.conference))]

    if (draft.filterInfo['dropdown'])
      teamsToShow = draft.filterInfo['dropdown'].value ?
        teamsToShow.filter(x => x[draft.filterInfo['dropdown'].key] === draft.filterInfo['dropdown'].value) :
        teamsToShow

    if (draft.filterInfo['search'] && draft.filterInfo['search'].value)
      teamsToShow = teamsToShow.filter(x =>
        x[draft.filterInfo['search'].key].toLowerCase().includes(draft.filterInfo['search'].value.toLowerCase()))


    if (teamsToShow && !allowDraft)
    {
      teamsToShow = teamsToShow.map(team => {return {...team,disableDraft:true }})
    }
    else{
      teamsToShow = teamsToShow.map(team => {
        if (!draft.eligibleTeams.includes(team.team_id))
          return {...team,disableDraft:true }
        else
          return team
      })
    }


    return (
      <div style={{height:730, minHeight:730, maxHeight:730}}>
        <TeamsDialog />
        <DerbyTableContainer
          passUpFilterInfo={this.passUpFilterInfo}
          usePagination={true}
          myRows={teamsToShow}
          filters={[
            {type:'tab',
              values :this.props.sportLeagues.map(x => x.sport),
              column:'sport',
              allInd:true,
              tabStyles:{background:'#E2E2E2', foreground:'white', text:'#229246'}
            },
            {type:'dropdown',
              values:confs,
              column:'conference',
              name:'Conference'
            },
            {type:'search',
              column:'team_name',
            },
          ]}
          myHeaders = {[
            {key: 'logo_url', sortId:'team_name',imageInd:true},
            {label: 'Team Name', key: 'team_name'},
            {key: 'team_id',
              button:{
                disabledBackgroundColor:'#d3d3d3',
                disabled:'disableQueue',
                labelOverride:'true',
                onClickOverride:'true',
                onClick:this.addItem,
                label:'Add to Queue',
                color:'white',
                backgroundColor: '#269349'//'#EBAB38',
              }},
            {key: 'team_id',
              button:{
                disabledBackgroundColor:'#d3d3d3',
                disabled:'disableDraft',
                onClick:this.draftTeam,
                label:'Draft Team',
                color:'white',
                backgroundColor: '#EBAB38',
              }},
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
      sportLeagues : state.sportLeagues,
      activeLeague : state.activeLeague,
      draft : state.draft,
      teams:state.teams
    }),
  dispatch =>
    ({onFilterTab(filterInfo) {
      dispatch(
        handleFilterTab(filterInfo))
    },}))(TeamDisplay)

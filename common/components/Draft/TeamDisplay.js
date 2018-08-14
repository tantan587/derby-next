import React from 'react'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import {handleFilterTab} from '../../actions/draft-actions'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
import FilterCreator from '../Filters/FilterCreator'
import Filterer from '../Filters/Filterer'
const R = require('ramda')


const styleProps = {
  Container:{
    overflowY:'scroll',
    maxHeight:540
  },
}

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
  render() {
    const page = 'draft-teams'
    const {  draft, teams,activeLeague, allowDraft, contentFilter} = this.props
    const allTeams = draft.allTeams
    const queue = draft.queue
    let confs = []
    let teamsToShow = []

    if (allTeams)
    {
      allTeams.map(teamId => {
        if (draft.draftedTeams.includes(teamId))
          teamsToShow.push({...teams[teamId],disableQueue:true, draftOverride:{text:'Drafted', icon:'Taken'}, queueOverride:{text:'Not eligible', icon:'N/A'}, eligible:false, checkbox:'Drafted' })
        else if(!draft.eligibleTeams.includes(teamId))
          teamsToShow.push({...teams[teamId],disableQueue:true, queueOverride:{text:'Not eligible', icon:'N/A'}, eligible:false, checkbox:'Available' })
        else if(queue.indexOf(teamId) === -1)
          teamsToShow.push({...teams[teamId], eligible:true, checkbox:true})
        else
          teamsToShow.push({...teams[teamId], queueOverride:{text:'Remove From Queue', icon:'Remove'},onClickOverride:this.removeItem, eligible:true, checkbox:true })
      })
      
      teamsToShow = teamsToShow.map(x => {
        return {...x, 
          projectedPoints:activeLeague.teams[x.team_id].proj_points,
          lastYearPoints:activeLeague.teams[x.team_id].lastYearPoints, 
          ranking:activeLeague.teams[x.team_id].ranking }
      })

      teamsToShow.sort((x,y) => {return x.ranking > y.ranking ?  1 : - 1})
      teamsToShow.forEach((x,i) => {
        x.ranking = i+1
      })

      R.values(contentFilter[page]).forEach(filter => {
        teamsToShow = Filterer(teamsToShow, filter)
        if(filter.type === 'tab'){
          confs = [...new Set(teamsToShow.map(x => x.conference))]
          confs.sort()
        }
      })
    
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
    }
    const filters = [{
      type:'tab',
      displayType:'sportsName',
      values:['All'].concat(R.map(x => x.sport_id, this.props.activeLeague.rules)),
      column:'sport_id',
      defaultTab:0,
      tabStyles:{backgroundColor:'#e3dac9',
        color:'#48311A',
        selectedBackgroundColor:'white', 
        selectedColor:'#229246',
        fontSize:16}
    },{type:'dropdown',
      values:confs,
      column:'conference',
      name:'Conference'
    },
    {type:'search',
      column:'team_name',
    },
    {type:'checkbox',
      column:'checkbox',
      values:['Drafted', 'Available']
    }
    ]

    return (
      <div >
        <TeamsDialog />
        <FilterCreator page={page} filters={filters}/>
        <DerbyTableContainer
          usePagination={true}
          myRows={teamsToShow}
          styleProps={styleProps}
          myHeaders = {[
            {key: 'logo_url', sortId:'team_name',imageInd:true},
            {label: 'Team Name', key: 'team_name'},
            {label: 'Sport', key: 'sport_id', imageInd:true},
            {label: 'Conference', key: 'conference'},
            {key: 'team_id', sortId:'eligible',
              button:{
                disabledBackgroundColor:'#d3d3d3',
                disabled:'disableQueue',
                labelOverride:'queueOverride',
                onClickOverride:'true',
                onClick:this.addItem,
                label:'Add to Queue',
                iconLabel:'Queue',
                color:'white',
                backgroundColor: '#269349'//'#EBAB38',
              }},
            {key: 'team_id',
              button:{
                disabledBackgroundColor:'#d3d3d3',
                disabled:'disableDraft',
                labelOverride:'draftOverride',
                onClick:this.draftTeam,
                label:'Draft Team',
                iconLabel:'Draft',
                color:'white',
                backgroundColor: '#EBAB38',
              }},
            {label: 'Proj. Rank', key: 'ranking'},
            {label: 'Proj. Points', key: 'projectedPoints'},
            {label: 'Prev. Points', key: 'lastYearPoints'},
            // {label: 'Points', key: 'points'}
          ]}/>
      </div>
    )
  }
}

export default connect(
  state =>
    ({
      contentFilter:state.contentFilter,
      activeLeague : state.activeLeague,
      draft : state.draft,
      teams:state.teams
    }),
  dispatch =>
    ({onFilterTab(filterInfo) {
      dispatch(
        handleFilterTab(filterInfo))
    },}))(TeamDisplay)

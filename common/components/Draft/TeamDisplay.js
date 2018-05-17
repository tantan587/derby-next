import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import {handleFilterTab} from '../../actions/draft-actions'
import TeamsDialog from '../TeamsDialog/TeamsDialog'

const styles = theme => ({
  greenFullCircle: {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor:'green',
  },
  greenOutlineCircle: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    borderColor : 'green',
    borderWidth:2,
    border:'solid'
  },
  button : {
    backgroundColor: theme.palette.secondary.A700,
    color: theme.palette.secondary.A100,
  },
  banner : {
    color: theme.palette.secondary[100],
    backgroundColor: theme.palette.primary[500],
  }
})

class TeamDisplay extends React.Component {
  addItem = (team) =>
  {
    this.props.onAddQueue(team)
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

    console.log(newFilterInfo)

    this.props.onFilterTab(newFilterInfo)
  }

  render() {
    const {  draft,teams } = this.props
    const availableTeams = draft.availableTeams
    const queue = draft.queue
    let teamsToShow = []
    availableTeams.map(teamId => {
      if(queue.indexOf(teamId) === -1)
        teamsToShow.push(teams[teamId])
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

    return (
      <div>
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
                onClick:this.addItem,
                label:'Add to Queue',
                color:'white',
                backgroundColor: '#269349'//'#EBAB38',
              }},
            {key: 'team_id',
              button:{
                onClick:this.addItem,
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
        handleFilterTab(teamIds))
    },}))(withStyles(styles)(TeamDisplay))

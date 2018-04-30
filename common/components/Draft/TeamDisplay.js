import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import { connect } from 'react-redux'
import {handleFilterTab} from '../../actions/draft-actions'

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
  constructor(props, context) {
    super(props, context)

    this.state = {
      teamIdsHold : [],
      teamIdsToUse : []
    }
  }

  // componentWillMount() {
  //   this.setState({teamIdsToUse:this.state.teamIdsHold})
  // }
  // componentWillReceiveProps(nextProps) {
  //   this.setState({teamIdsToUse:this.state.teamIdsHold})
  // }

  addItem = (team) =>
  {
    this.props.onAddQueue(team)
  }

  passUpFilterInfo = (filterInfo) =>
  {
    
    const newFilterInfo = this.props.draft.filterInfo
    newFilterInfo[filterInfo.type] = {'key':filterInfo.key, 'value': filterInfo.value}

    console.log(newFilterInfo)
    
    this.props.onFilterTab(newFilterInfo) 
  }

  render() {
    const { classes, draft,teams } = this.props
    const availableTeams = draft.availableTeams
    const queue = draft.queue
    let teamsToShow = []
    availableTeams.map(teamId => {
      if(queue.indexOf(teamId) === -1)
        teamsToShow.push(teams[teamId])
    })
    if (draft.filterInfo['tab'])
      teamsToShow = teamsToShow.filter(x => x[draft.filterInfo['tab'].key] === draft.filterInfo['tab'].value)

    if (draft.filterInfo['search'] && draft.filterInfo['search'].value)
      teamsToShow = teamsToShow.filter(x => 
        x[draft.filterInfo['search'].key].toLowerCase().includes(draft.filterInfo['search'].value.toLowerCase()))

    return (
      <div style={{maxHeight:700, overflow:'auto'}}>
        <DerbyTableContainer
          passUpFilterInfo={this.passUpFilterInfo}
          usePagination={true}
          myRows={teamsToShow}
          filters={[
            {type:'tab', 
              values :this.props.sportLeagues.map(x => x.sport),
              column:'sport',
              tabColors:{background:'#E2E2E2', foreground:'white', text:'#229246'}
            },
            {type:'search',
              column:'team_name', 
            },
          ]}
          myHeaders = {[
            {key: 'logo_url', sortId:'team_name'},
            {label: 'Team Name', key: 'team_name'},
            {key: 'team_id', 
              button:{
                onClick:this.addItem,
                label:'Queue',
                color:'white',
                backgroundColor: '#269349'//'#EBAB38',
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

TeamDisplay.propTypes = {
  classes: PropTypes.object.isRequired,
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
    ({onFilterTab(teamIds) {
      dispatch(
        handleFilterTab(teamIds))
    },}))(withStyles(styles)(TeamDisplay))
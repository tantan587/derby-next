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
    this.props.dataForTeams.addToQueue(team)
  }

  passUpFilterInfo = (filterInfo) =>
  {
    console.log(filterInfo, this.props.draft.filterInfo)
    this.props.onFilterTab(filterInfo)
    
  }

  render() {
    const { classes, draft,teams,dataForTeams } = this.props
    const availableTeams = draft.availableTeams
    const queue = draft.queue
    const linesToShow = dataForTeams.linesToShow
    let teamsToShow = []
    availableTeams.map(teamId => {
      if(queue.indexOf(teamId) === -1)
        teamsToShow.push(teams[teamId])
    })
    if (draft.filterInfo.key && draft.filterInfo.value)
      teamsToShow = teamsToShow.filter(x => x[draft.filterInfo.key] === draft.filterInfo.value)
    return (
      <div>
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
          ]}
          myHeaders = {[
            {label: 'Logo', key: 'logo_url', sortId:'team_name'},
            {label: 'Team Name', key: 'team_name'},
            {label: 'Conference', key: 'conference'}
          ]}/>
        <Toolbar style={{backgroundColor:'#DDDDDD'}}>
          <Typography variant="title" color="inherit">
            Autosuggest for team, chips for sport, draft toggle
          </Typography>
        </Toolbar>

        <List style={{maxHeight: 600, overflow: 'auto'}}>
          <Divider />
          {teamsToShow.slice(0,linesToShow).map( team => 
            <div key={team.team_id}>
              <ListItem key={team.team_id} style={{paddingTop:0, paddingLeft:100}}>
                {/* <Avatar>
                  <ImageIcon />
                </Avatar> */}
                <ListItemText primary={team.team_name}/>
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  //className={classes.close}
                  onClick={() => this.addItem(team.team_id)}
                >
                  <ChevronRightIcon />
                </IconButton>
              </ListItem>
            </div>
          )}
        </List>

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
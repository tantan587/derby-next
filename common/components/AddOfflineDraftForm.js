import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import SortableList from './SortableList'
import DraftRoundInput from './DraftRoundInput'
import {clickedSaveDraft, handleUpdateDraftOrder} from '../actions/sport-actions'
import { connect } from 'react-redux'

const styles = theme => ({
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
  },
  text: {color:'black',
    marginLeft:'10%',
    marginRight:'10%'
  },
  button : {
    backgroundColor: theme.palette.secondary.A700,
    color: theme.palette.secondary.A100,
  }
})

class AddOfflineDraftForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      round:0,
      allTeamsDrafted:[],
      confsSelected:[],
      sportsSelected:[]
    }

    this.onRoundForward = this.onRoundForward.bind(this)
    this.onRoundBackward = this.onRoundBackward.bind(this)
  }
  

  onRoundForward(round, sports, confs, teams)
  {
    if(teams.filter(team => team === '').length === 0 )
    {
      let allTeamsDrafted = this.state.allTeamsDrafted
      let confsSelected = this.state.confsSelected
      let sportsSelected = this.state.sportsSelected
      teams.map((team, i) => allTeamsDrafted.push({team_id:team,round:round, draft_position:i}))
      confs.map((conf, i) => confsSelected[i].push({ conference_id: conf, round: round }))
      sports.map((sport, i) => sportsSelected[i].push({ sport: sport, round: round }))
      this.setState({round:round+1,allTeamsDrafted,confsSelected, sportsSelected})
    }
  }
  onRoundBackward(round)
  {
    const allTeamsDrafted = this.state.allTeamsDrafted.filter(team => team.round !==  round-1)
    let confsSelected = []
    this.state.confsSelected.map((confs,i) => {
      confsSelected[i] = confs.filter(conf => conf.round !== round-1)
    })

    let sportsSelected = []
    this.state.sportsSelected.map((sports,i) => {
      sportsSelected[i] = sports.filter(sport => sport.round !== round-1)
    })
    this.setState({round:this.state.round-1, allTeamsDrafted, confsSelected,sportsSelected })
  }
  onRoundFirst(len)
  {
    let confsSelected = []
    let sportsSelected = []
    Array.apply(null, {length: len}).map(Function.call, Number).map(i => confsSelected[i] = [])
    Array.apply(null, {length: len}).map(Function.call, Number).map(i => sportsSelected[i] = [])
    this.setState({round:this.state.round+1, confsSelected, sportsSelected})

  }

  submit() {
    const draftPositionsToOwnerMap = {}
    this.props.activeLeague.owners.map(
      owner => draftPositionsToOwnerMap[owner.draft_position] = owner.owner_id)
    const allTeams =  this.state.allTeamsDrafted.map(team => {
      const teamRow = {owner_id:draftPositionsToOwnerMap[team.draft_position], 
        team_id:team.team_id, 
        overall_pick:(team.draft_position+1 + (team.round-1)*this.props.activeLeague.owners.length)}
      return teamRow})  
        
    this.props.onSaveDraft(this.props.activeLeague.league_id, allTeams)
    Router.push('/')
  }

  // this.props.activeLeague.total_teams

  keypress(e) {
    if (e.key === 'Enter') { 
      this.myLogin(e)
    }
  }
  render() {
    if(this.state.fireRedirect && this.props.user.loggedIn === true){
      Router.push('/')
      return(<div></div>)
    }
    else{
      const { classes, activeLeague, teams, sportLeagues } = this.props
      const { round } = this.state
      const owners = []
      if (this.props.activeLeague.owners)
      {
        this.props.activeLeague.owners.map(
          owner => owners.push({id:owner.user_id, text:owner.owner_name, order:owner.draft_position }))
        owners.sort(function(a,b) { return a.order-b.order})
      }
      return (
        <form className={classes.container} noValidate autoComplete="off"
          onKeyPress={(event) => this.keypress(event)}>
          <Typography type="display2" style={{color:'black'}} gutterBottom>
            Enter in Offline Draft
          </Typography>
          {(activeLeague.total_players !== activeLeague.max_owners)
            ?
            <Typography type="subheading" className={classes.text} gutterBottom>
            The league has not been fully set yet. You are still waiting on {activeLeague.max_owners-activeLeague.total_players}
              {activeLeague.max_owners-activeLeague.total_players === 1 ? ' more owner.' : ' more owners.'}
            </Typography>
            :
            round === 0 
              ?
              <div>
                <Typography type="subheading" className={classes.text} gutterBottom>
                  {'Some text explaining how to sort.' + round }
                </Typography>
                <SortableList  items={owners} updateOrder={this.props.onUpdateDraftOrder}/>
                <Button raised className={classes.button} onClick={() => this.onRoundFirst(this.props.activeLeague.owners.length)}>
                Submit
                </Button>
              </div>
              :
              round <= this.props.activeLeague.total_teams ?  
                <div>
                  <Typography type="subheading" className={classes.text} gutterBottom>
                    {'Explain how to draft' }
                  </Typography>
                  <Typography type="subheading" className={classes.text} gutterBottom>
                    {'Round: ' + round}
                  </Typography>
                  <DraftRoundInput 
                    round={round} 
                    owners={round % 2 === 1 ? owners: owners.reverse()} 
                    teams={teams} 
                    sportLeagues={sportLeagues} 
                    allTeamsDrafted={this.state.allTeamsDrafted}
                    confsSelected={this.state.confsSelected}
                    sportsSelected={this.state.sportsSelected}
                    onRoundForward={this.onRoundForward}
                    onRoundBackward={this.onRoundBackward}/>
                </div>
                :
                <Button raised className={classes.button} onClick={() => this.submit()}>
                Submit
                </Button>
              
          }
          
         
        </form>
      )
    }
  }
}

AddOfflineDraftForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      activeLeague : state.activeLeague,
      teams : state.teams,
      sportLeagues : state.sportLeagues
    }),
  dispatch =>
    ({
      onSaveDraft(league_id, allTeams) {
        dispatch(clickedSaveDraft(league_id, allTeams))
      },
      onUpdateDraftOrder(draftOrder) {
        dispatch(handleUpdateDraftOrder(draftOrder))
      },
    })  
)(withStyles(styles)(AddOfflineDraftForm))



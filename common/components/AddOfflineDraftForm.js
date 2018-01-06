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
import { owners } from '../store/reducers';

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
      ownerConferences:[]
    }

    this.onRoundForward = this.onRoundForward.bind(this)
    this.onRoundBackward = this.onRoundBackward.bind(this)
  }
  

  onRoundForward(round, confs, teams)
  {
    // if(teams.filter(team => team === '').length === 0 )
    // {
      let allTeamsDrafted = this.state.allTeamsDrafted
      let ownerConferences = this.state.ownerConferences

      teams.map(team => allTeamsDrafted.push({team_id:team,round:round}))
      confs.map((conf, i) => ownerConferences[i].push({ conference_id: conf, round: round }))
      this.setState({round:round+1,allTeamsDrafted,ownerConferences })
    //}
  }
  onRoundBackward(round)
  {
    const allTeamsDrafted = this.state.allTeamsDrafted.filter(team => team.round !==  round-1)
    let ownerConferences = []
    this.state.ownerConferences.map((confs,i) => {
      ownerConferences[i] = confs.filter(conf => conf.round !== round-1)
    })
    this.setState({round:this.state.round-1, allTeamsDrafted, ownerConferences})
  }
  onRoundFirst(len)
  {
    let ownerConferences = []
    Array.apply(null, {length: len}).map(Function.call, Number).map(i => ownerConferences[i] = [])
    this.setState({round:this.state.round+1})
    this.setState({ownerConferences:ownerConferences})
  }

  submit(e) {
    this.myLogin(e)
  }

  // updateDraftOrder(draftOrder)
  // {
  //   console.log(this.props)
  //   console.log(draftOrder)
  //   const { onUpdateDraftOrder } = this.props
  //   console.log(draftOrder)
  //   onUpdateDraftOrder(draftOrder)
  // }

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
          owner => owners.push({id:owner.user_id, text:owner.owner_name, order:owner.draft_positon }))
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
                  ownerConferences={this.state.ownerConferences}
                  onRoundForward={this.onRoundForward}
                  onRoundBackward={this.onRoundBackward}/>
              </div>
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
      onSaveDraft(mainTabDisplay) {
        dispatch(clickedSaveDraft(mainTabDisplay))
      },
      onUpdateDraftOrder(draftOrder) {
        dispatch(handleUpdateDraftOrder(draftOrder))
      },
    })  
)(withStyles(styles)(AddOfflineDraftForm))



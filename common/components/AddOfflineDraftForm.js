import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
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
  state = {
    page:0
  }

  myLogin(e)
  {
    const { onLogin } = this.props
    this.setState({fireRedirect: true})
    e.preventDefault()
    onLogin(this.state.username, this.state.password)
  }

  onPageTurn()
  {
    this.setState({page:this.state.page+1})
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
      const { page } = this.state
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
            page === 0 
              ?
              <div>
                <Typography type="subheading" className={classes.text} gutterBottom>
                  {'Some text explaining how to sort.' + page }
                </Typography>
                <SortableList  items={owners} updateOrder={this.props.onUpdateDraftOrder}/>
                <Button raised className={classes.button} onClick={() => this.onPageTurn()}>
                Submit
                </Button>
              </div>
              :
              <div>
                <Typography type="subheading" className={classes.text} gutterBottom>
                  {'Explain how to draft' }
                </Typography>
                <Typography type="subheading" className={classes.text} gutterBottom>
                  {'Round: ' + page}
                </Typography>
                <DraftRoundInput owners={page % 2 === 1 ? owners: owners.reverse()} teams={teams} sportLeagues={sportLeagues}/>
                <Button raised className={classes.button} onClick={() => this.onPageTurn()}>
                Submit
                </Button>
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



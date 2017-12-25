import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import {clickedJoinLeague} from '../actions/fantasy-actions'
import DerbyTextField from './DerbyTextField'

import { connect } from 'react-redux'

const styles = {
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
    width: 300,
  },
  text: {color:'black',
    marginLeft:'10%',
    marginRight:'10%'
  },
  menu: {
    width: 200,
  }
  ,
  centeredText: {
    textAlign: 'center',
  },
}

class JoinLeagueForm extends React.Component {
  state={
    league_name:'',
    league_password:'',
    owner_name:'',
    fireRedirect: false
  }


  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleSubmit(e)
  {
    const { onJoinLeague } = this.props
    this.setState({fireRedirect: true})
    e.preventDefault()
    onJoinLeague(this.state.league_name, this.state.league_password,this.state.owner_name)	
  }

  submit(e) {
    this.handleSubmit(e)
  }

  keypress(e) {
    if (e.key === 'Enter') { 
      this.handleSubmit(e)
    }
  }

  render() {
    if(this.state.fireRedirect && this.props.user.error.success === true){
      Router.push('/')
      return(<div></div>)
    }
    else if(this.props.user.loggedIn === false){
      if (typeof document !== 'undefined'){
        Router.push('/login')
      }
      return(<div></div>)
    }
    else{
      const { classes } = this.props
      
      return (
        <form className={classes.container} noValidate autoComplete="off"
          onKeyPress={(event) => this.keypress(event)}>
          <Typography type="display2" style={{color:'black'}} gutterBottom>
            Join Existing League
          </Typography>
          <br/>
          <DerbyTextField
            errorText={this.props.user.error.join_league_name}
            label="Enter The League Name"
            value={this.state.league_name}
            onChange = {this.handleChange('league_name')}
          />
          <br/>
          <DerbyTextField
            errorText={this.props.user.error.join_league_password}
            label="Enter The League Password"
            value={this.state.league_password}
            onChange = {this.handleChange('league_password')}/>
          <br/>
          <DerbyTextField
            errorText={this.props.user.error.join_owner_name}
            label="Enter Your Owner Name"
            value={this.state.owner_name}
            onChange = {this.handleChange('owner_name')}/>
          <br/>
          <br/>
          <Button raised color="accent" onClick={(event) => this.submit(event)}>
            Join The League!
          </Button>
        </form>
      )
    }
  }
}

JoinLeagueForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user : state.user
    }),
  dispatch =>
    ({
      onJoinLeague(league_name, league_password, owner_name) {
        dispatch(
          clickedJoinLeague(league_name, league_password, owner_name))
      }
    }))(withStyles(styles)(JoinLeagueForm))



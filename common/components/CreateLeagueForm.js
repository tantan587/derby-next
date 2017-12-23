import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import {clickedCreateLeague} from '../actions/fantasy-actions'
import MenuItem from 'material-ui/Menu/MenuItem'

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
  textField: {
    textAlign: 'center',
  }
}

class CreateLeagueForm extends React.Component {
  state={
    league_name:'',
    league_password:'',
    EPL:false,
    max_owners:8,
    privateInd:true,
    owner_name:'',
    fireRedirect : false
  }

  updateEPLCheck = () => {
    this.setState({ EPL: !this.state.EPL })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  handleSubmit(e)
  {
    const { onCreateLeague } = this.props
    this.setState({fireRedirect: true})
    e.preventDefault()
    onCreateLeague(this.state)	
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
      Router.push('/login')
      return(<div></div>)
    }
    else{
      const { classes } = this.props
      return (
        <form className={classes.container} noValidate autoComplete="off"
          onKeyPress={(event) => this.keypress(event)}>
          <Typography type="display2" style={{color:'black'}} gutterBottom>
            Create New League
          </Typography>
          <br/>
          <Typography type="subheading" className={classes.text} gutterBottom>
          Time to create your own league! Our default league
          contains NBA, NFL, MLB, NHL, College Football, and NCAA Basketball.
          You draft one team per conference in the professional sports,
          and 3 teams from 3 different conferences in each college sport.
          Have questions? Learn more about it here.
          </Typography>
          <TextField
            id="name"
            error={typeof this.props.user.error.create_league_name !== 'undefined'}
            className={classes.field}
            helperText = {this.props.user.error.create_league_name}
            label="Enter A League Name"
            value={this.state.league_name}
            margin="normal"
            onChange = {this.handleChange('league_name')}/>
          <br/>
          <TextField
            error={typeof this.props.user.error.create_password !== 'undefined'}
            id="password"
            label="Enter A League Password"
            helperText = {this.props.user.error.create_password}
            className={classes.field}
            value={this.state.league_password}
            margin="normal"
            onChange = {this.handleChange('league_password')}/>
          <br/>
          <TextField
            id="num-players"
            select
            label="Number of Owners"
            className={classes.field}
            value={this.state.max_owners}
            margin="normal"
            onChange = {this.handleChange('max_owners')}>
            {Array(8).fill().map((d, i) => i + 8).map(option => (
              <MenuItem key={option} value={option}>
                {option + ' Teams'}
              </MenuItem>
            ))}
          </TextField>
          <br/>
          <TextField
            id="private-public"
            select
            label="Private or Public League?"
            className={classes.field}
            value={this.state.privateInd}
            margin="normal"
            onChange = {this.handleChange('privateInd')}>
            {['Private', 'Public'].map(option => (
              <MenuItem key={option} value={option==='Private'}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <br/>
          <TextField
            id="epl"
            select
            label="Use English Premier League?"
            className={classes.field}
            value={this.state.EPL}
            margin="normal"
            onChange = {this.handleChange('EPL')}>
            {['Ew... Soccer', 'Yes Please.'].map(option => (
              <MenuItem key={option} value={option==='Yes Please.'}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <br/>
          <TextField
            id="owner_name"
            error={typeof this.props.user.error.create_owner_name !== 'undefined'}
            className={classes.field}
            helperText = {this.props.user.error.create_owner_name}
            label="Enter Your Owner Name"
            value={this.state.owner_name}
            margin="normal"
            onChange = {this.handleChange('owner_name')}/>
          <br/>
          <br/>
          <Button raised color="accent" onClick={(event) => this.submit(event)}>
            Create New League!
          </Button>
        </form>
      )
    }
  }
}

CreateLeagueForm.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user : state.user
    }),
  dispatch =>
    ({
      onCreateLeague(leagueInfo) {
        dispatch(
          clickedCreateLeague(leagueInfo))
      }
    }))(withStyles(styles)(CreateLeagueForm))



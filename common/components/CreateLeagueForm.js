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
import DerbyTextField from './DerbyTextField'

import { connect } from 'react-redux'

const privateIndBool = ['Private. I\'m very selective', 'Public. I need some friends']
const EPLBool = ['GOOOOOOOOALLLLLL','Ew... Soccer']

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

  handleBoolChange = (name, str) => event => {
    this.setState({
      [name]: event.target.value === str,
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
      if (typeof document !== 'undefined'){
        Router.push('/login')
      }
      return(<div></div>)
    }
    else{
      const { classes } = this.props
      const InputProps = {
        inputProps: {
          className: classes.centeredText,
        }
      }
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
          <DerbyTextField
            errorText={this.props.user.error.create_league_name}
            label="Enter A League Name"
            value={this.state.league_name}
            onChange = {this.handleChange('league_name')}
          />
          <br/>
          <DerbyTextField
            errorText={this.props.user.error.create_password}
            label="Enter A League Password"
            value={this.state.league_password}
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
            value={this.state.privateInd ? privateIndBool[0] : privateIndBool[1]}
            margin="normal"
            onChange = {this.handleBoolChange('privateInd', privateIndBool[0])}>
            {privateIndBool.map(option => (
              <MenuItem key={option} value={option}>
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
            value={this.state.EPL? EPLBool[0]: EPLBool[1]}
            margin="normal"
            onChange = {this.handleBoolChange('EPL', EPLBool[0])}>
            {EPLBool.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <br/>
          <DerbyTextField
            errorText={this.props.user.error.create_owner_name}
            label="Enter Your Owner Name"
            value={this.state.owner_name}
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



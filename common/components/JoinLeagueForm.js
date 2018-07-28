import React from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {withRouter} from 'next/router'
import { connect } from 'react-redux'
import C from '../constants'
import DerbyTextField from './DerbyTextField'
import Title from './Navigation/Title'
import { clickedJoinLeague, updateError } from '../actions/fantasy-actions'
import StyledButton from './Navigation/Buttons/StyledButton'
const R = require('ramda')

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50
  },
  title: {
    fontFamily: 'museo-slab-bold',
    fontSize: 26,
    textTransform: 'uppercase',
    color: '#299149'
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

  componentWillUnmount() {

    this.props.onUpdateError(C.PAGES.JOIN_LEAGUE, '')

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
      const { classes, user } = this.props
      const errorText = user.error[C.PAGES.JOIN_LEAGUE]

      return (
        <div>
          <Title color='white' backgroundColor='#EBAB38' title='Join League'/>
          <form className={classes.container} noValidate autoComplete="off"
            onKeyPress={(event) => this.keypress(event)}>
            <Typography variant="display2" className={classes.title} gutterBottom>
              Join Existing League
            </Typography>
            <DerbyTextField
              style={{width:300}}
              label="League name"
              value={this.state.league_name}
              onChange = {this.handleChange('league_name')}
            />
            <DerbyTextField
              style={{width:300}}
              label="Password"
              value={this.state.league_password}
              onChange = {this.handleChange('league_password')}/>
            <Typography variant='subheading' style={{color:'red', marginTop:20}}>
              {errorText}
            </Typography>
            <StyledButton
              onClick={(event) => this.submit(event)}
              width={130}
              height={40}
              text="Join League"
              styles={{ marginTop: errorText ? 16 : 40, fontSize: 15, fontWeight: 500 }}
            />
          </form>
        </div>
      )
    }
  }
}

JoinLeagueForm.propTypes = {
  classes: PropTypes.object.isRequired,
}



export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['user']), {onJoinLeague: clickedJoinLeague, onUpdateError: updateError}),
)(JoinLeagueForm)
    

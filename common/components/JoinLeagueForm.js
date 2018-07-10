import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import DerbyTextField from './DerbyTextField'
import Title from './Navigation/Title'
import { clickedJoinLeague } from '../actions/fantasy-actions'
import StyledButton from './Navigation/Buttons/StyledButton'

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
        <div>
          <Title
            backgroundColor="#EBAB38"
            color="white"
            title="League Directory"
            styles={{
              fontSize: 22,
              height: 40,
              lineHeight: '40px',
              paddingTop: 0,
              textTransform: 'capitalize'
            }}
          />
          <form className={classes.container} noValidate autoComplete="off"
            onKeyPress={(event) => this.keypress(event)}>
            <Typography variant="display2" className={classes.title} gutterBottom>
              Join Existing League
            </Typography>
            <DerbyTextField
              errorText={this.props.user.error.join_league_name}
              label="League name"
              value={this.state.league_name}
              onChange = {this.handleChange('league_name')}
            />
            <DerbyTextField
              errorText={this.props.user.error.join_league_password}
              label="Password"
              value={this.state.league_password}
              onChange = {this.handleChange('league_password')}/>
            <StyledButton
              onClick={(event) => this.submit(event)}
              width={130}
              height={40}
              text="Join League"
              styles={{ marginTop: 26, fontSize: 15, fontWeight: 500 }}
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

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Title from '../Navigation/Title'
import LeagueInfo from './LeagueInfo/LeagueInfo'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import {clickedCreateLeague} from '../../actions/fantasy-actions'
const R = require('ramda')

const styles = theme =>({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    //marginTop: 80
  },
  content: {
    width: '80%',
    [theme.breakpoints.only('sm')]: {
      width: '85%'
    },
    [theme.breakpoints.only('xs')]: {
      width: '90%'
    },
  },
  title: {
    fontFamily: 'HorsebackSlab',
    fontSize: 32,
    color: '#299149'
  }
})

// const myTabs = [
//   { label: 'League Info & Draft', Component: <LeagueInfo /> },
//   //{ label: 'Manage League Members', Component: <ManageEmails /> },
// ]

class CreateLeague extends React.Component {
  state = {
    leagueInfo : 
      {
        name: '',
        password: '',
        matchPassword: '',
        owners: 8,
        premier:false,
        draftType: 'Online - Snake Format',
        pickTime: 60,
        draftDate: new Date((new Date()).getTime() + 7 * 86400000),
        showError:false
      }
  }

  setDeepState = (key, name, value) => {
    this.setState({
      [key]:{
        ...this.state[key],
        [name]: value,
      }
    })
  }

  handleChange = name => event => {

    let newValue = name === 'premier' ? event.target.checked : name === 'draftDate' ?  event : event.target.value

    this.setDeepState('leagueInfo', name, newValue)
    
  }

  onSubmit = () => {
    this.setDeepState('leagueInfo','showError', true)
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title='Create League'/>
        <div className={classes.root}>
          <div className={classes.content}>
            <LeagueInfo leagueInfo={this.state.leagueInfo} onSubmit={this.onSubmit} handleChange={this.handleChange}/>
          </div>
        </div>
      </div>
    )
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['user']), {onCreateLeague: clickedCreateLeague}),
)(CreateLeague)

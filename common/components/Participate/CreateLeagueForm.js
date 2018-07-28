import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Title from '../Navigation/Title'
import LeagueInfo from '../LeagueSettings/LeagueInfo/LeagueInfo'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import {clickedCreateLeague, updateError} from '../../actions/fantasy-actions'
import C from '../../constants'
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

class CreateLeagueForm extends React.Component {
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
        draftDate: new Date((new Date()).getTime() + 7 * 86400000)
      }
  }

  componentWillUnmount() {

    this.props.onUpdateError(C.PAGES.CREATE_LEAGUE, '')

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

  getErrorText = () => 
  {
    const {leagueInfo} = this.state
    
    if (leagueInfo.name.length < 6)
      return 'League Name must be longer than 5 characters'
    if (leagueInfo.name.length > 20)
      return 'League Name must be shorter than 21 characters'
    if (leagueInfo.password !== leagueInfo.matchPassword)
      return 'Passwords do not match'
    if (leagueInfo.password.length < 8)
      return 'Password must be longer than 7 characters'
    if (leagueInfo.password.length > 20)
      return 'Password must be shorter than 21 characters'
    if (leagueInfo.draftDate - new Date() < 86400000)
      return 'Draft Date/Time must be at least 24 hours from now'
    return ''

  }

  onSubmit = () => {
    let errorText = this.getErrorText()
    if (errorText)
    {
      this.props.onUpdateError(C.PAGES.CREATE_LEAGUE, errorText)
    }
    else
    {
      this.props.onCreateLeague(this.state.leagueInfo)
    }
  }

  render() {
    const { classes, user } = this.props
    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title='Create League'/>
        <div className={classes.root}>
          <div className={classes.content}>
            <LeagueInfo leagueInfo={this.state.leagueInfo} errorText={user.error[C.PAGES.CREATE_LEAGUE]} onSubmit={this.onSubmit} handleChange={this.handleChange}/>
          </div>
        </div>
      </div>
    )
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['user']), {onCreateLeague: clickedCreateLeague, onUpdateError: updateError}),
)(CreateLeagueForm)

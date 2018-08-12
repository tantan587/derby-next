import React from 'react'
import io from 'socket.io-client'
import {getSportSeasons, handleTeamUpdateTime, handleGameUpdateTime,
  handleTeamUpdate, handleGameUpdate,
  handleTeamUpdateDiff, handleGameUpdateDiff } from '../../actions/sport-actions'
import { connect } from 'react-redux'
const R = require('ramda')


class SportsSocket extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sportSeasons:[]
    }
  }
  static getDerivedStateFromProps(nextProps){
    return {sportSeasons:nextProps.sportSeasons}
  }

  
  componentDidUpdate(prevProps,prevState){

    if (prevState.sportSeasons.length != prevState.sportSeasons.length ||
    prevState.sportSeasons.some((x,i)=> x !== this.state.sportSeasons[i]))
      this.socket.emit('allTeamData', this.props.sportSeasons)
  }

  // connect to WS server and listen event
  componentDidMount() {
    if(this.props.sportSeasons.length === 0)
      this.props.onGetSportSeasons(this.props.activeLeague && this.props.activeLeague.league_id)
    this.socket = io('/sports')
    this.socket.on('connect', () => {
      this.socket.emit('gameUpdateTime')
      this.socket.emit('teamUpdateTime')
    })
    this.socket.on('serverTeamUpdateTime', this.checkTeamUpdateTime)
    this.socket.on('serverAllTeamData', this.getTeams)
    this.socket.on('serverDiffTeamData', this.getTeamsDiff)
    this.socket.on('serverGameUpdateTime', this.checkGameUpdateTime)
    this.socket.on('serverAllGameData', this.getGames)
    this.socket.on('serverDiffGameData', this.getGamesDiff)

    setTimeout(() => {
      if(!this.props.teams)
        this.socket.emit('allTeamData', this.props.sportSeasons)
    },5000)
  }

  getTeams = (data) => {
    data = this.filterOnRules(data)
    this.props.onTeamUpdate(data)
    
  }

  getTeamsDiff = (data) => {
    //needs to be handled better for playoffs
    const {onTeamUpdateDiff, onTeamUpdateTime, sportSeasons} = this.props

    let dataForMe = {}
    if(sportSeasons.length > 0)
    {
      sportSeasons.forEach(seasonId => {
        if(data.diff[seasonId])
        {
          Object.assign(dataForMe, data.diff[seasonId])
        }
      })  
    }
    
    dataForMe = this.filterOnRules(dataForMe)
    if(Object.keys(dataForMe).length > 0)
    {
      onTeamUpdateDiff(dataForMe)
    }
    
    onTeamUpdateTime(data.updateTime)
  }

  filterOnRules = (data) => {
    const {activeLeague} = this.props
    let rtnData = data
    if(activeLeague && activeLeague.rules)
    {
      rtnData = {}
      let conferences = R.flatten(activeLeague.rules.map(x => x.conferences)).map(x => x.conference_id)
      let teams = Object.values(data).filter(x => conferences.includes(x.conference_id))
      teams.forEach(x => {
        rtnData[x.team_id] = x
      })
      
    }
    return rtnData
  }

  getGames = (data) => {
    this.props.onGameUpdate(data)
  }

  getGamesDiff = (data) => {
    this.props.onGameUpdateDiff(data.diff)
    this.props.onGameUpdateTime(data.updateTime)
  }

  checkTeamUpdateTime = (time) =>
  {

    if (!this.props.updateTime.teams || new Date(time) > new Date(this.props.updateTime.teams))
    {
      this.socket.emit('allTeamData', this.props.sportSeasons)
      this.props.onTeamUpdateTime(time)   
    }
  }

  checkGameUpdateTime = (time) =>
  {
    if (!this.props.updateTime.games || new Date(time) > new Date(this.props.updateTime.games))
    {
      this.socket.emit('allGameData')
      this.props.onGameUpdateTime(time)   
    }
  }

  componentWillUnmount() {
    // this.state.sockets.map((socket,i) => 
    //   this.socket.off(socket, this.state.functions[i]))
    this.socket.close()
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    ) 
  }
}

export default connect(
  state =>
    ({
      teams:state.teams,
      updateTime:state.updateTime,
      sportSeasons:state.sportSeasons,
      activeLeague:state.activeLeague
    }),
  dispatch =>
    ({
      onGetSportSeasons(league_id) {
        dispatch(getSportSeasons(league_id))
      },
      onTeamUpdateTime(updateTime) {
        dispatch(
          handleTeamUpdateTime(updateTime))
      },
      onTeamUpdate(teams) {
        dispatch(
          handleTeamUpdate(teams))
      },
      onTeamUpdateDiff(teamsDiff) {
        dispatch(
          handleTeamUpdateDiff(teamsDiff))
      },
      onGameUpdateTime(updateTime) {
        dispatch(
          handleGameUpdateTime(updateTime))
      },
      onGameUpdate(games) {
        dispatch(
          handleGameUpdate(games))
      },
      onGameUpdateDiff(gamesDiff) {
        dispatch(
          handleGameUpdateDiff(gamesDiff))
      },
    }))(SportsSocket)
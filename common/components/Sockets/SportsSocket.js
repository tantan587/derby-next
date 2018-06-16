import React from 'react'
import io from 'socket.io-client'
import {handleTeamUpdateTime, handleGameUpdateTime,
  handleTeamUpdate, handleGameUpdate,
  handleTeamUpdateDiff, handleGameUpdateDiff } from '../../actions/sport-actions'
import { connect } from 'react-redux'


class SportsSocket extends React.Component {

  componentWillMount() {
  }
  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io('/sports')
    this.socket.on('connect', () => {
      this.socket.emit('teamUpdateTime')
      this.socket.emit('gameUpdateTime')
    })
    this.socket.on('serverTeamUpdateTime', this.checkTeamUpdateTime)
    this.socket.on('serverAllTeamData', this.getTeams)
    this.socket.on('serverDiffTeamData', this.getTeamsDiff)
    this.socket.on('serverGameUpdateTime', this.checkGameUpdateTime)
    this.socket.on('serverAllGameData', this.getGames)
    this.socket.on('serverDiffGameData', this.getGamesDiff)
  }

  getTeams = (data) => {
    this.props.onTeamUpdate(data)
    //fire off action to update data
  }

  getTeamsDiff = (data) => {
    this.props.onTeamUpdateDiff(data.diff)
    this.props.onTeamUpdateTime(data.updateTime)
    //fire off action to update data
  }

  getGames = (data) => {

    this.props.onGameUpdate(data)
    //fire off action to update data
  }

  getGamesDiff = (data) => {
    console.log(data)
    this.props.onGameUpdateDiff(data.diff)
    this.props.onGameUpdateTime(data.updateTime)
    //fire off action to update data
  }

  checkTeamUpdateTime = (time) =>
  {

    if (!this.props.updateTime.teams || new Date(time) > new Date(this.props.updateTime.teams))
    {
      this.socket.emit('allTeamData')
      this.props.onTeamUpdateTime(time)   
    }
  }

  checkGameUpdateTime = (time) =>
  {
    console.log(time)
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
      updateTime:state.updateTime
    }),
  dispatch =>
    ({
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
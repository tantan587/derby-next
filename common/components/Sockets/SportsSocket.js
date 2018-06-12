import React from 'react'
import io from 'socket.io-client'
import {handleTeamUpdateTime,
  handleTeamUpdate, handleTeamUpdateDiff } from '../../actions/sport-actions'
import { connect } from 'react-redux'


class SportsSocket extends React.Component {

  componentWillMount() {
  }
  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io('/sports')
    this.socket.on('connect', () => {
      this.socket.emit('updateTime')
    })
    this.socket.on('serverUpdateTime', this.checkUpdateTime)
    this.socket.on('serverAllTeamData', this.getTeams)
    this.socket.on('serverDiffTeamData', this.getTeamsDiff)
  }

  getTeams = (data) => {
    this.props.onTeamUpdate(data)
    //fire off action to update data
  }

  getTeamsDiff = (data) => {
    console.log(data)
    this.props.onTeamUpdateDiff(data.diff)
    this.props.onTeamUpdateTime(data.updateTime)
    //fire off action to update data
  }

  checkUpdateTime = (time) =>
  {
    if (new Date(time) > new Date(this.props.updateTime.teams))
    {
      this.socket.emit('allTeamData')
      this.props.onTeamUpdateTime(time)   
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
    }))(SportsSocket)
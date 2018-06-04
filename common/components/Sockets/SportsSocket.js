import React from 'react'
import io from 'socket.io-client'
import {clickedEnterDraft} from '../../actions/draft-actions'
import { connect } from 'react-redux'


class SportsSocket extends React.Component {

  componentWillMount() {
    console.log('here')
    // this.props.onEnterDraft(
    //   this.props.activeLeague.room_id, this.props.activeLeague.my_owner_id)
  }
  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io('/sports')
    console.log('hello', this.socket)
    this.socket.on('connect', () => {
      this.socket.emit('updateTime')
    })
    this.socket.on('serverUpdateTime', this.checkUpdateTime)
    this.socket.on('serverDataFull', this.getData)
    this.socket.on('serverDataDiff', this.getData)
  }

  getData = (data) => {
    console.log(data)
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
      teams:state.teams
    }),
  dispatch =>
    ({
      onEnterDraft(room_id, owner_id) {
        dispatch(
          clickedEnterDraft(room_id, owner_id))
      },
    }))(SportsSocket)
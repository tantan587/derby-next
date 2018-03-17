
const socketIoHelpers = require('./socketioHelpers')
const draftHelpers = require('../routes/helpers/draftHelpers')
const ServerDraftInfo = require('../../common/models/ServerDraftInfo')

const messages = []
let draftTimers = {}
let ownersInDraft = {}
const timeToDraft = 3

const clearTimers = (roomId) =>
{
  clearInterval(draftTimers[roomId])
  clearTimeout(draftTimers[roomId])
}

const waitToAutoDraft = (io, roomId, draftInfo) =>
{
  let counter = timeToDraft
  clearTimers(roomId)

  io.in(roomId).emit('draftTick', counter)

  draftTimers[roomId] = setInterval(() => {
    if(counter === 0){
      clearInterval(draftTimers[roomId])
      const teamId = draftInfo.GetAutoDraftTeam()
      const ownerId = draftInfo.GetCurrentOwnerId()
      const localPick = draftInfo.GetThenIncrementPick()
      console.log(localPick, teamId, ownerId)
      io.in(roomId).emit('draftInfo', {teamId, ownerId})
      waitToAutoDraft(io, roomId, draftInfo)
      return
    }
    counter -= 1
    io.in(roomId).emit('draftTick', counter)
    console.log('counting in autodraft')
    
  }, 1000)
}

const waitToStartDraft = (io, roomId, time, draftInfo) =>
{
  let counter = 0
  clearTimers(roomId)
  draftTimers[roomId] = setInterval(() => {
    if(time < counter){
      clearInterval(draftTimers[roomId])
      io.in(roomId).emit('start')
      socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'live'})
      waitToAutoDraft(io, roomId, draftInfo)
      return
    }
    counter += 1000
    console.log('counting in start draft', time, counter)
    io.in(roomId).emit('startTick')
  }, 1000)
}

const draftRoom = (io, socket) =>
{
  let roomId
  let localRoom
  let draftInfo

  //closure
  //let pick = (() => {let count = 0; return () => {return count++}})()
  
  socket.on('join', roomInfo =>
  {
    roomId = roomInfo.roomId
    socket.join(roomId)
    localRoom = io.sockets.adapter.rooms[roomId]
    console.log(roomId, socket.id)
    console.log('room length: ' + localRoom.length)
    console.log(localRoom)

    if(!ownersInDraft[roomId])
      ownersInDraft[roomId] = {}
    ownersInDraft[roomId][socket.id]= roomInfo.owner_id

    let owners = []
    Object.keys(localRoom.sockets).map(socketId =>{
      if(localRoom.sockets[socketId])
        owners.push(ownersInDraft[roomId][socketId])
    })
    
    io.in(roomId).emit('people', 
      {state:'joined',
        owners:owners,
        owner_id:roomInfo.owner_id})

    if(localRoom.length === 1)
    {
      socketIoHelpers.GetDraftInfo(roomId)
        .then(res => {
          draftInfo = new ServerDraftInfo(
            res.draft_position,
            draftHelpers.GetDraftOrder(res.total_teams,res.draft_position.length),
            res.availableTeams)
          const time = new Date(res.start_time)- new Date()
          if(time > 0)
          {
            waitToStartDraft(io, roomId, time, draftInfo)//time)
          }
        })
    }

  })

  socket.in(roomId).on('message', (data) => {
    data.sid = (new Date()).getTime()
    messages.push(data)
    io.in(roomId).emit('message', data)
  })

  socket.in(roomId).on('startTime', (startTime) => {
    socketIoHelpers.RestartDraft(roomId)
    
    
    let date = new Date(new Date().getTime() + startTime * 1000)
    io.in(roomId).emit('reset', {draftStartTime: date.toJSON()})
    
    draftInfo.StartAgain()

    waitToStartDraft(io, roomId, startTime*1000, draftInfo)

  })

  socket.in(roomId).on('queue', (queue) => {
    socketIoHelpers.InsertDraftAction(
      roomId, ownersInDraft[roomId][socket.id], 'QUEUE', {queue:queue})
  })

  socket.in(roomId).on('draft', (data) => {
    const ownerId = ownersInDraft[roomId][socket.id]
    draftInfo.DraftedTeam(data.teamId)
    const localPick = draftInfo.GetThenIncrementPick()
    console.log(localPick, data.teamId, ownerId)

    socketIoHelpers.InsertDraftAction(
      roomId, ownerId, 'PICK', {pick:localPick, teamId:data.teamId}, data.clientTs)
    data = {...data, ownerId:ownerId}
    io.in(roomId).emit('draftInfo',data)

    waitToAutoDraft(io, roomId, draftInfo)
  })

  socket.on('disconnect', () => {
    if(ownersInDraft[roomId] && ownersInDraft[roomId][socket.id])
    {
      io.in(roomId).emit('people', {state:'left', owner_id:ownersInDraft[roomId][socket.id]})
      delete ownersInDraft[roomId][socket.id]
    }
    if(localRoom && localRoom.length===0 && draftTimers[roomId])
    {
      socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'pre'})
      clearTimeout(draftTimers[roomId])
      delete draftTimers[roomId]
    }
  })

}


module.exports = {
  draftRoom
}
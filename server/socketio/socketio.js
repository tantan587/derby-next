
const socketIoHelpers = require('./socketioHelpers')

const messages = []
let draftTimers = {}
let ownersInDraft = {}
const timeToDraft = 10
let i = 0

const clearTimers = (roomId) =>
{
  clearInterval(draftTimers[roomId])
  clearTimeout(draftTimers[roomId])
}

const waitToAutoDraft = (io, roomId, pick) =>
{
  let counter = timeToDraft
  clearTimers(roomId)

  io.in(roomId).emit('draftTick', counter)

  draftTimers[roomId] = setInterval(() => {
    if(counter === 0){
      clearInterval(draftTimers[roomId])
      i++
      const localPick = pick()
      console.log(i, 'localPick', localPick, 'Draft Here')
      io.in(roomId).emit('draftInfo')
      waitToAutoDraft(io, roomId, pick)
      return
    }
    counter -= 1
    io.in(roomId).emit('draftTick', counter)
    console.log('counting in autodraft')
    
  }, 1000)
}

const waitToStartDraft = (io, roomId, time, pick) =>
{
  let counter = 0
  clearTimers(roomId)
  draftTimers[roomId] = setInterval(() => {
    if(time < counter){
      clearInterval(draftTimers[roomId])
      io.in(roomId).emit('start')
      socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'live'})
      waitToAutoDraft(io, roomId, pick)
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
  //closure
  let pick = (() => {let count = 0; return () => {return count++}})()
  
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
    console.log(ownersInDraft)

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
      socketIoHelpers.GetDraftTime(roomId)
        .then(res => {
          const time = new Date(res)- new Date()
          if(time > 0)
          {
            waitToStartDraft(io, roomId, time, pick)//time)
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
    //resetting closure
    pick = (() => {let count = 0; return () => {return count++}})()
    let date = new Date(new Date().getTime() + startTime * 1000)
    io.in(roomId).emit('reset', {draftStartTime: date.toJSON()})
    waitToStartDraft(io, roomId, startTime*1000, pick)

  })

  socket.in(roomId).on('queue', (queue) => {
    socketIoHelpers.InsertDraftAction(
      roomId, ownersInDraft[roomId][socket.id], 'QUEUE', {queue:queue})
  })

  socket.in(roomId).on('draft', (data) => {
    let localPick = pick()
    console.log(localPick, data)
    socketIoHelpers.InsertDraftAction(
      roomId, ownersInDraft[roomId][socket.id], 'PICK', {pick:localPick, teamId:data.teamId}, data.clientTs)
    io.in(roomId).emit('draftInfo',data)
    waitToAutoDraft(io, roomId, pick)
  })

  socket.on('disconnect', () => {
    io.in(roomId).emit('people', {state:'left', owner_id:ownersInDraft[roomId][socket.id]})
    delete ownersInDraft[roomId][socket.id]
    if(localRoom && localRoom.length===0 && draftTimers[roomId])
    {
      clearTimeout(draftTimers[roomId])
      delete draftTimers[roomId]
    }
  })

}


module.exports = {
  draftRoom
}
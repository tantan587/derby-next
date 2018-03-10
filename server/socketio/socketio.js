
const socketIoHelpers = require('./socketioHelpers')

const messages = []
let draftTimers = {}
let ownersInDraft = {}
const timeToDraft = 10
let i = 0

const clearTimers = (roomName) =>
{
  clearInterval(draftTimers[roomName])
  clearTimeout(draftTimers[roomName])
}

const waitToAutoDraft = (io, roomName) =>
{
  let counter = timeToDraft
  clearTimers(roomName)

  io.in(roomName).emit('draftTick', counter)

  draftTimers[roomName] = setInterval(() => {
    if(counter === 0){
      clearInterval(draftTimers[roomName])
      i++
      console.log(i,'Draft Here')
      io.in(roomName).emit('draftInfo')
      waitToAutoDraft(io, roomName)
      return
    }
    counter -= 1
    io.in(roomName).emit('draftTick', counter)
    console.log('counting in autodraft')
    
  }, 1000)
}

const waitToStartDraft = (io, roomName, time) =>
{
  let counter = 0
  clearTimers(roomName)
  draftTimers[roomName] = setInterval(() => {
    if(time < counter){
      clearInterval(draftTimers[roomName])
      io.in(roomName).emit('start')
      socketIoHelpers.InsertDraftAction(roomName, 'server', 'STATE', {'mode':'live'})
      waitToAutoDraft(io, roomName)
      return
    }
    counter += 1000
    console.log('counting in start draft', time, counter)
    io.in(roomName).emit('startTick')
  }, 1000)
}

const draftRoom = (io, socket) =>
{
  let roomName
  let localRoom 
  
  socket.on('join', roomInfo =>
  {
    
    roomName = roomInfo.roomName
    socket.join(roomName)
    localRoom = io.sockets.adapter.rooms[roomName]
    console.log('room length: ' + localRoom.length)
    console.log(localRoom)

    if(!ownersInDraft.roomName)
      ownersInDraft.roomName = []
    ownersInDraft.roomName.push(roomInfo.owner_id)

    io.in(roomName).emit('people', 
      {state:'joined',
        owners:ownersInDraft.roomName,
        owner_id:roomInfo.owner_id})

    if(localRoom.length === 1)
    {
      socketIoHelpers.GetDraftTime(roomName)
        .then(res => {
          const time = new Date(res)- new Date()
          if(time > 0)
          {
            waitToStartDraft(io, roomName, time)//time)
          }
        })
    }

  })

  socket.in(roomName).on('message', (data) => {
    data.sid = (new Date()).getTime()
    messages.push(data)
    io.in(roomName).emit('message', data)
  })

  socket.in(roomName).on('startTime', (startTime) => {
    socketIoHelpers.RestartDraft(roomName)
    let date = new Date(new Date().getTime() + startTime * 1000)
    io.in(roomName).emit('reset', {draftStartTime: date.toJSON()})
    waitToStartDraft(io, roomName, startTime*1000)

  })

  socket.in(roomName).on('draft', () => {
    io.in(roomName).emit('draftInfo')
    waitToAutoDraft(io, roomName)
  })

  socket.in(roomName).on('leave', (owner_id) => {
    
    const index = ownersInDraft.roomName.indexOf(owner_id)
    if (index > -1) {
      ownersInDraft.roomName.splice(index, 1)
    }

    io.in(roomName).emit('people', {state:'left', owner_id:owner_id})
    if(localRoom.length===1 && draftTimers[roomName])
    {
      clearTimeout(draftTimers[roomName])
      draftTimers[roomName] = undefined
    }
  })

}


module.exports = {
  draftRoom
}
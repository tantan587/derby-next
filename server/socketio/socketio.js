const socketIoHelpers = require('./socketioHelpers')

const messages = []
let draftTimers = {}

const draftRoom = (io, socket) =>
{
  let roomName
  let localRoom 
  
  socket.on('join', roomInfo =>
  {
    
    roomName = roomInfo.roomName
    io.in(roomName).emit('people', {state:'joined', owner_id:roomInfo.owner_id})
    socket.join(roomName)
    localRoom = io.sockets.adapter.rooms[roomName]
    console.log('room length: ' + localRoom.length)

    //sets up draft time
    //need logic to update on draft update. 
    if(localRoom.length === 1)
    {
      socketIoHelpers.GetDraftTime(roomName)
        .then(res => {
          const time = new Date(res)- new Date()
          if(time > 0)
          {
            draftTimers[roomName] = setTimeout(() => io.in(roomName).emit('start'), time)
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
    let date = new Date(new Date().getTime() + startTime * 1000)
    io.in(roomName).emit('stop')
    io.in(roomName).emit('restart', {clock: 10, draftStartTime: date.toJSON()})

    clearTimeout(draftTimers[roomName])
    draftTimers[roomName] = setTimeout(() => io.in(roomName).emit('start'),1000*startTime)
  })

  socket.in(roomName).on('draft', () => {
    io.in(roomName).emit('restart', {clock: 10})
  })

  socket.in(roomName).on('leave', (owner_id) => {
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
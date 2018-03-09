
const socketIoHelpers = require('./socketioHelpers')

const messages = []
let draftTimers = {}
let ownersInDraft = {}
const timeToDraft = 10
let i = 0

const autoDraft = (io, roomName) =>
{
  i++
  console.log(i,'Draft Here')
  io.in(roomName).emit('restart', {clock: timeToDraft})
  clearTimeout(draftTimers[roomName])
  draftTimers[roomName] =
  setTimeout(() => autoDraft(io, roomName),timeToDraft*1000)
}

const myRestart = (io,roomName) =>
{
  console.log('myRestart')
  io.in(roomName).emit('start')
  io.in(roomName).emit('restart', {clock: timeToDraft})
  clearTimeout(draftTimers[roomName])
  draftTimers[roomName] =
  setTimeout(() =>  autoDraft(io, roomName),timeToDraft*1000)
}

const runAtLaterTime = (io, roomName, time) =>
{
  clearTimeout(draftTimers[roomName])
  if (time > 0x7FFFFFFF)
    draftTimers[roomName] = setTimeout(
      () => {runAtLaterTime(io, roomName, time-0x7FFFFFFF)}, 0x7FFFFFFF)
  else
    draftTimers[roomName] = setTimeout(() => 
      myRestart(io, roomName), time)
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

    io.in(roomName).emit('people', {state:'joined',owners:ownersInDraft.roomName, owner_id:roomInfo.owner_id})
    //sets up draft time
    //need logic to update on draft update. 
    if(localRoom.length === 1)
    {
      socketIoHelpers.GetDraftTime(roomName)
        .then(res => {
          const time = new Date(res)- new Date()
          if(time > 0)
          {
            runAtLaterTime(io, roomName, time)
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
    io.in(roomName).emit('reset', {draftStartTime: date.toJSON()})

    clearTimeout(draftTimers[roomName])
    draftTimers[roomName] = setTimeout(() => {
      myRestart(io, roomName)
    }, 1000*startTime)
  })

  socket.in(roomName).on('draft', () => {
    io.in(roomName).emit('restart', {clock: timeToDraft})
    clearTimeout(draftTimers[roomName])
    draftTimers[roomName] =
    setTimeout(() =>  autoDraft(io, roomName),timeToDraft*1000)
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

const socketIoHelpers = require('./socketioHelpers')
const DraftManager = require('./DraftManager')

const messages = []
let ownersInDraft = {}
let draftManagers = {}


const waitToAutoDraft = (io, draftInfo) =>
{
  const emitDraftTick = (roomId, counter) =>
  {
    io.in(roomId).emit('draftTick', counter)
  }

  const sendDraftInfo = (roomId, teamId, ownerId) =>
  {
    io.in(roomId).emit('draftInfo', {teamId, ownerId})
  }
  draftInfo.WaitToAutoDraft(emitDraftTick,sendDraftInfo)
}

const waitToStartDraft = (io, draftInfo) =>
{
  const emitStartTick = (roomId) =>
  {
    io.in(roomId).emit('startTick')
  }
  const startDraft = (roomId) =>
  {
    io.in(roomId).emit('start')
    socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'live'})
  }
  const emitDraftTick = (roomId, counter) =>
  {
    io.in(roomId).emit('draftTick', counter)
  }

  const sendDraftInfo = (roomId, teamId, ownerId) =>
  {
    io.in(roomId).emit('draftInfo', {teamId, ownerId})
  }
  draftInfo.WaitToStartDraft(emitStartTick, startDraft, emitDraftTick, sendDraftInfo)
}

const draftRoom = (io, socket) =>
{
  let roomId
  let localRoom
  
  socket.on('join', async roomInfo =>
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
      console.log('Im setting up the room')
      if (draftManagers[roomId])
        draftManagers[roomId].Clear()
      draftManagers[roomId] = new DraftManager(roomId)
      await draftManagers[roomId].Create()
      if(draftManagers[roomId].TimeUntilStart() > 0)
      {
        waitToStartDraft(io,draftManagers[roomId])//time)
      }

    }
  })

  socket.in(roomId).on('message', (data) => {
    data.sid = (new Date()).getTime()
    messages.push(data)
    io.in(roomId).emit('message', data)
  })

  socket.in(roomId).on('startTime', async startTime => {
    socketIoHelpers.RestartDraft(roomId)
    
    
    let date = new Date(new Date().getTime() + startTime * 1000)
    io.in(roomId).emit('reset', {draftStartTime: date.toJSON()})

    if(!draftManagers[roomId])
    {
      draftManagers[roomId] = new DraftManager(roomId)
      await draftManagers[roomId].Create()
    }
    draftManagers[roomId].StartAgain(startTime*1000)

    waitToStartDraft(io, draftManagers[roomId])

  })

  socket.in(roomId).on('queue', (queue) => {
    socketIoHelpers.InsertDraftAction(
      roomId, ownersInDraft[roomId][socket.id], 'QUEUE', {queue:queue})
  })

  socket.in(roomId).on('draft', (data) => {
    const ownerId = ownersInDraft[roomId][socket.id]
    draftManagers[roomId].DraftedTeam(data.teamId)
    const localPick = draftManagers[roomId].GetThenIncrementPick()
    console.log(localPick, data.teamId, ownerId)

    socketIoHelpers.InsertDraftAction(
      roomId, ownerId, 'PICK', {pick:localPick, teamId:data.teamId}, data.clientTs)
    data = {...data, ownerId:ownerId}
    io.in(roomId).emit('draftInfo',data)

    waitToAutoDraft(io,draftManagers[roomId])
  })

  socket.on('disconnect', () => {
    if(ownersInDraft[roomId] && ownersInDraft[roomId][socket.id])
    {
      io.in(roomId).emit('people', {state:'left', owner_id:ownersInDraft[roomId][socket.id]})
      delete ownersInDraft[roomId][socket.id]
    }
    if (draftManagers[roomId])
    {
      draftManagers[roomId].Clear()
      delete draftManagers[roomId]
    }
    if(localRoom && localRoom.length===0)
    {
      socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'pre'})
    }
  })

}


module.exports = {
  draftRoom
}
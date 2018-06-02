
const socketIoHelpers = require('./socketioHelpers')
const DraftManager = require('./Draft/DraftManager')
const draftManagers = {}

const checkForActiveDrafts = async (io) => {
  const roomIds = await socketIoHelpers.GetActiveDrafts()
  roomIds.map(async roomId => {
    if(!draftManagers[roomId])
    {
      draftManagers[roomId] = new DraftManager(io, roomId)
      // eslint-disable-next-line no-console
      console.log('Im starting Draft', roomId)
      await draftManagers[roomId].Create()
      // eslint-disable-next-line no-console
      draftManagers[roomId].Start()
      console.log('Started', roomId)
    }
  })}

const startSocketIo = (io) =>
{
  setInterval(() => checkForActiveDrafts(io), 2000)

  io.sockets.on('connection', socket => draftRoom(io,socket))
}



const draftRoom = (io, socket) =>
{
  let roomId

  const draftIsGood = () =>{
    return draftManagers[roomId] && draftManagers[roomId].DraftIsUp()
  }

  socket.on('join', roomInfo =>
  {
    roomId = roomInfo.roomId
    socket.join(roomId)
    
    if(draftIsGood())
    {
      draftManagers[roomId].OwnerJoined(socket.id, roomInfo.owner_id)
    }
  })

  socket.on('imhere', ownerId =>
  {
    if(draftIsGood())
    {
      draftManagers[roomId].OwnerJoined(socket.id, ownerId)
    }
  })

  socket.in(roomId).on('restartDraft', async () => {
    
    if(draftIsGood())
    {
      draftManagers[roomId].StartAgain()
    }
  })

  socket.in(roomId).on('timeToDraft', async startTime => {
    
    if(draftIsGood())
    {
      draftManagers[roomId].SetTimeToDraft(startTime)
    }
  })

  socket.in(roomId).on('timeout', (amountOfTime) => {
    
    if(draftIsGood())
    {
      draftManagers[roomId].Timeout(amountOfTime)
    }
  })

  socket.in(roomId).on('timein', () => {
    
    if(draftIsGood())
    {
      draftManagers[roomId].TimeIn()
    }
  })
  
  socket.in(roomId).on('queue', (data) => {
    if(draftIsGood())
    {
      draftManagers[roomId].SetQueue(socket.id, data.queue)
    }
    socketIoHelpers.InsertDraftAction(
      roomId, data.ownerId, 'QUEUE', {queue:data.queue})
  
  })

  socket.in(roomId).on('message', (message) => {
    if(draftIsGood())
    {
      draftManagers[roomId].ProcessMessage(socket.id, message)
    }
    
  })

  socket.in(roomId).on('addqueue', (data) => {
    if(draftIsGood())
    {
      draftManagers[roomId].TryUpdateQueue(data)
    }
    else{
      const distinctQueue = [...new Set(data.queue.concat([data.teamId]))]
      socketIoHelpers.InsertDraftAction(
        roomId, data.ownerId, 'QUEUE', {queue:distinctQueue})
      io.in(roomId).emit('addqueueresp', {ownerId:data.ownerId, queue:distinctQueue, success:true})
    }  
  })

  socket.in(roomId).on('draft', (data) => {
    if(draftIsGood())
    {
      draftManagers[roomId].DraftedTeam(socket.id,data)
    } 
  })

  socket.on('disconnect', () => {
    if(draftIsGood())
    {
      draftManagers[roomId].OwnerLeft(socket.id)
    }
  })
}

module.exports = {
  startSocketIo
}
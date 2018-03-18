
const socketIoHelpers = require('./socketioHelpers')
const DraftManager = require('./DraftManager')
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
  setInterval(() => checkForActiveDrafts(io), 10000)

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
    // eslint-disable-next-line no-console
    console.log(roomId, io.sockets.adapter.rooms[roomId])
    if(draftIsGood())
    {
      draftManagers[roomId].OwnerJoined(socket.id, roomInfo.owner_id)
    }
  })

  socket.on('imhere', ownerId =>
  {
    draftManagers[roomId].OwnerJoined(socket.id, ownerId)
  })

  socket.in(roomId).on('message', (data) => {
    data.sid = (new Date()).getTime()
    io.in(roomId).emit('message', data)
  })

  socket.in(roomId).on('startTime', async startTime => {
    
    if(draftIsGood())
    {
      draftManagers[roomId].StartAgain(startTime*1000)
    }
  })
  
  socket.in(roomId).on('queue', (queue) => {
    if(draftIsGood())
    {
      draftManagers[roomId].UpdateQueue(socket.id, queue)
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
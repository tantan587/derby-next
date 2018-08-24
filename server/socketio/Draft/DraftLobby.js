const socketIoHelpers = require('../socketioHelpers')
const DraftManager = require('./DraftManager')
const DraftEmitter = require('./DraftEmitter')




class DraftLobby {
  constructor(io)
  {
    this.draftNSP = io.of('/draft')
    this.draftRooms = {}
  }

  async Create() {

    const roomIds = await socketIoHelpers.GetFutureDrafts()
    console.log(roomIds)
    roomIds.forEach( roomId =>
    {
      this.addToDraftRoom(roomId)
    })
  }

  addToDraftRoom(roomId) {
    this.draftRooms[roomId] = {}
    this.draftRooms[roomId].Emitter = new DraftEmitter(this.draftNSP,roomId)
  }

  async Activate() {
    setInterval(() => this.CheckForActiveDraft(), 2000)

    this.draftNSP.on('connection', socket => 
    { 
      this.DraftListener(socket)
    })
  }  

  async CheckForActiveDraft() {
    const roomIds = await socketIoHelpers.GetActiveDrafts()
    roomIds.forEach(async roomId => {
      if(!this.draftRooms[roomId])
      {
        console.log('added ' + roomId)
        this.addToDraftRoom(roomId)
      }
      if(this.draftRooms[roomId] && !this.draftRooms[roomId].Manager)
      {

        this.draftRooms[roomId].Manager = new DraftManager(roomId, this.draftRooms[roomId].Emitter)
        await this.draftRooms[roomId].Manager.Create()
        await this.draftRooms[roomId].Manager.Start()
      }
    })}

  //const checkForInactiveDrafts

  DraftListener(socket) {
    let roomId

    const draftIsGood = () =>{
      return this.draftRooms[roomId] && this.draftRooms[roomId].Manager && this.draftRooms[roomId].Manager.DraftIsUp()
    }

    socket.on('join', roomInfo =>
    {
      console.log(roomInfo)
      roomId = roomInfo.roomId
      socket.join(roomId)
      if(draftIsGood())
      {
        console.log('I joined!')
        this.draftRooms[roomId].Manager.OwnerJoined(socket.id, roomInfo.owner_id)
      }
    })

    socket.in(roomId).on('imhere', ownerId =>
    {
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.OwnerJoined(socket.id, ownerId)
      }
    })

    socket.in(roomId).on('restartDraft', async () => {
      
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.StartAgain()
      }
      else{
        this.draftRooms[roomId].Emitter = new DraftEmitter(this.draftNSP,roomId)
        this.draftRooms[roomId].Manager = new DraftManager(roomId, this.draftRooms[roomId].Emitter)
        await this.draftRooms[roomId].Manager.Create()
        this.draftRooms[roomId].Manager.StartAgain()
      }
    })

    socket.in(roomId).on('timeToDraft', async startTime => {
      
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.SetTimeToDraft(startTime)
      }
    })

    socket.in(roomId).on('timeout', (amountOfTime) => {
      
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.Timeout(amountOfTime)
      }
    })

    socket.in(roomId).on('timein', () => {
      
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.TimeIn()
      }
    })
    
    socket.in(roomId).on('queue', (data) => {
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.SetQueue(socket.id, data.queue)
      }
      socketIoHelpers.InsertDraftAction(
        roomId, data.ownerId, 'QUEUE', {queue:data.queue})
    
    })

    socket.in(roomId).on('message', (message) => {
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.ProcessMessage(socket.id, message)
      }
      
    })

    socket.in(roomId).on('addqueue', (data) => {
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.TryUpdateQueue(data)
      }
      else{
        const distinctQueue = [...new Set(data.queue.concat([data.teamId]))]
        
        socketIoHelpers.InsertDraftAction(
          roomId, data.ownerId, 'QUEUE', {queue:distinctQueue})
        this.draftRooms[roomId].Emitter.EmitQueueSuccess(data.ownerId, distinctQueue)
      }  
    })

    socket.in(roomId).on('draft', (data) => {
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.DraftedTeamFromClient(socket.id,data)
      } 
    })

    socket.on('disconnect', () => {
      if(draftIsGood())
      {
        this.draftRooms[roomId].Manager.OwnerLeft(socket.id)
      }
    })
  }
}

module.exports = DraftLobby
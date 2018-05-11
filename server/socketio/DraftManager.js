const draftHelpers = require('../routes/helpers/draftHelpers')
const socketIoHelpers = require('./socketioHelpers')
const Owners = require('./Draft/Owners')

function DraftManager(io, roomId) {
  
  var that = this
  const timeToDraft = 5
  var draftIsUp = false
 
  this.Create = async () =>
  {
    const resp = await socketIoHelpers.GetDraftInfo(roomId)
    that.draftPosition = resp.draft_position
    that.draftOrder =  draftHelpers.GetDraftOrder(resp.total_teams,resp.draft_position.length)
    that.allTeams = Array.from(resp.teams)
    that.time = new Date(resp.start_time)- new Date()
    that.owners = new Owners()
    that.owners.CreateOwners(resp.owners, resp.queueByOwner, roomId, resp.teams)
    that.counter = 0
  }

  this.DraftIsUp = () => {
    return draftIsUp
  }

  this.Start = () =>
  {
    that.pick = 0
    console.log(roomId, 'is online')
    console.log(io.sockets.adapter.rooms)
    emitWhosHere()
    waitToStartDraft()
  }

  this.OwnerJoined = (socketId, ownerId) =>
  {
    that.owners.Joined(socketId, ownerId)
    io.in(roomId).emit('people', 
      {state:'joined',
        owners:that.owners.WhoIsInDraft(),
        owner_id:ownerId})
  }

  this.OwnerLeft = (socketId) =>
  {
    const ownerId = that.owners.GetOwnerIdFromSocketId(socketId)
    that.owners.Left(socketId)
    io.in(roomId).emit('people', 
      {state:'left', owner_id:ownerId})

    //for now, start again when everyone leaves
    if(!io.sockets.adapter.rooms[roomId])
    {
      socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'pre'})
      this.Start()
    }
  }

  this.StartAgain = async (time) =>
  {
    draftIsUp = false
    await socketIoHelpers.RestartDraft(roomId)
    that.pick = 0
    that.time = time
    that.owners.ResetEligible()
    let date = new Date(new Date().getTime() + time)
    io.in(roomId).emit('reset', {draftStartTime: date.toJSON()})
    waitToStartDraft()
  }

  this.DraftedTeam = (socketId, data) => { 
    const ownerId = that.owners.GetOwnerIdFromSocketId(socketId)
    let resp = that.owners.TryDraft(ownerId,data.teamId)
    if (resp) 
      draftTeam(ownerId, data.teamId, resp, data.clientTs)
  }
  
  this.TryUpdateQueue = (data) => {
    if (that.owners.TryUpdateQueue(data))
    {
      const distinctQueue = [...new Set(data.queue.concat([data.teamId]))]
      socketIoHelpers.InsertDraftAction(
        roomId, data.ownerId, 'QUEUE', {queue:distinctQueue})
      addQueueResp({ownerId:data.ownerId, queue:distinctQueue, success:true})
    }
    else{
      addQueueResp({ownerId:data.ownerId, success:false, teamId:data.teamId})
    }
  }

  this.SetQueue = (socketId, queue) => {
    that.owners.SetQueue(socketId, queue)
  }

  this.Timeout = (amountOfTime) =>
  {
    console.log('in timeout')
    clearTimers()
    socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'timeout'})
    emitModeChange('timeout')
    if (amountOfTime) 
    {
      that.timer = setTimeout(() => {
        timeIn()
      }, 1000*amountOfTime)
    }
  }

  this.TimeIn = () =>
  {
    timeIn()
  }

  const waitToStartDraft = () => {
    draftIsUp = true
    let counter = 0
    clearTimers()
    that.timer = setInterval(() => {
      if(that.time < counter){
        clearInterval(that.timer)
        emitDraftLive()
        socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'live'})
        waitToAutoDraft(timeToDraft)
        return
      }
      counter += 1000

      console.log('counting in start draft', that.time, counter)

      emitStartTick(roomId)
    }, 1000)
  }

  const waitToAutoDraft = (timeOnClock) => {
    that.counter = timeOnClock
    clearTimers()
    emitDraftTick()
  
    that.timer = setInterval(() => {
      if(that.counter === 0){
        clearInterval(that.timer)
        const ownerId = getCurrentOwnerId()
        const teamId = getAutoDraftTeam(ownerId)
        let draftResult = that.owners.TryDraft(ownerId,teamId)

        draftTeam(ownerId,teamId, draftResult)
        return
      }
      that.counter -= 1
      emitDraftTick()
      console.log('counting in autodraft')
      
    }, 1000)
  }

  //the team id needs to be verified before this function is hit.
  const draftTeam = (ownerId, teamId, draftResult, clientTs = undefined) =>{
    
    that.owners.RemoveTeam(teamId)
    const localPick = getThenIncrementPick()

    console.log(localPick, teamId, ownerId)

    socketIoHelpers.InsertDraftAction(
      roomId, ownerId, 'PICK', {pick:localPick, teamId:teamId},clientTs)
    socketIoHelpers.InsertDraftAction(
      roomId, ownerId, 'QUEUE', {queue:draftResult.queue})

    io.in(roomId).emit('draftInfo',{
      teamId:teamId, ownerId:ownerId, queue:draftResult.queue, eligibleTeams:draftResult.eligibleTeams})
    waitToAutoDraft(timeToDraft)
  }

  const getThenIncrementPick = ()  => {
    that.pick++
    return that.pick -1  
  }

  const getAutoDraftTeam = (ownerId) => {
    return that.owners.GetNextTeam(ownerId)
  }

  const getCurrentOwnerId = () => {
    return that.draftPosition[that.draftOrder[that.pick].ownerIndex]
  }

  const clearTimers = () => {
    clearInterval(that.timer)
    clearTimeout(that.timer)
  }

  const timeIn = () => {
    socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'live'})
    emitModeChange('live')
    waitToAutoDraft(that.counter)
  }

  ///SOCKET IO FUNCTIONS
  const emitDraftLive = () => {
    io.in(roomId).emit('start')
  }

  const emitStartTick = () => {
    io.in(roomId).emit('startTick')
  }

  const emitDraftTick = () => {
    io.in(roomId).emit('draftTick', that.counter)
  }

  const emitWhosHere = () => {
    io.in(roomId).emit('whoshere')
  }

  const emitModeChange = (mode) => {
    io.in(roomId).emit('modechange', mode)
  }

  const addQueueResp = (payload) => {
    io.in(roomId).emit('addqueueresp', payload)
  }

  ////
}

module.exports = DraftManager
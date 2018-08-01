const draftHelpers = require('../../routes/helpers/draftHelpers')
const fantasyHelpers = require('../../routes/helpers/fantasyHelpers')
const socketIoHelpers = require('../socketioHelpers')
const Owners = require('./Owners')

function DraftManager(roomId, draftEmitter) {
  
  var that = this
  let timeToDraft = 5
  var draftIsUp = false
 
  this.Create = async () =>
  {
    const resp = await socketIoHelpers.GetDraftInfo(roomId)
    timeToDraft = resp.seconds_pick
    that.draftPosition = resp.draft_position
    that.draftOrder =  fantasyHelpers.GetDraftOrder(resp.total_teams,resp.draft_position.length)
    that.allTeams = Array.from(resp.teams)
    that.time = new Date(resp.start_time)- new Date()
    that.totalPicks = resp.totalPicks
    that.leagueId = resp.league_id
    that.owners = new Owners()
    await that.owners.CreateOwners(resp.owners, resp.queueByOwner, roomId, resp.teams)
    that.counter = 0
  }

  this.DraftIsUp = () => {
    return draftIsUp
  }

  this.Start = () =>
  {
    that.pick = 0
    console.log(roomId, 'is online')
    draftEmitter.EmitWhosHere()
    waitToStartDraft()
  }

  this.OwnerJoined = (socketId, ownerId) =>
  {
    that.owners.Joined(socketId, ownerId)
    draftEmitter.EmitJoined(that.owners.WhoIsInDraft(), ownerId)
  }

  this.OwnerLeft = (socketId) =>
  {
    const ownerId = that.owners.GetOwnerIdFromSocketId(socketId)
    that.owners.Left(socketId)
    draftEmitter.EmitLeft(ownerId)
  }

  this.EndDraft = () =>
  {
    socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'post'})
    draftEmitter.EmitModeChange('post')
    console.log('saving Teams')
    draftHelpers.enterDraftToDb(that.owners.AssembleTeams(), that.leagueId)
    //draftIsUp = false

  }

  this.StartAgain = async () =>
  {
    draftIsUp = false
    await socketIoHelpers.RestartDraft(roomId)
    that.pick = 0
    that.time = 5000
    that.owners.ResetEligible()
    let date = new Date(new Date().getTime() + that.time)
    draftEmitter.EmitReset(date.toJSON())
    waitToStartDraft()
  }

  this.SetTimeToDraft = async (inpTimeToDraft) =>
  {
    timeToDraft = inpTimeToDraft
  }

  this.DraftedTeam = (socketId, data) => { 
    const ownerId = that.owners.GetOwnerIdFromSocketId(socketId)
    let resp = that.owners.TryDraft(ownerId,data.teamId, that.pick)
    if (resp) 
      draftTeam(ownerId, data.teamId, resp, data.clientTs)
  }
  
  this.TryUpdateQueue = (data) => {
    if (that.owners.TryUpdateQueue(data))
    {
      const distinctQueue = [...new Set(data.queue.concat([data.teamId]))]
      socketIoHelpers.InsertDraftAction(
        roomId, data.ownerId, 'QUEUE', {queue:distinctQueue})
      draftEmitter.EmitQueueSuccess(data.ownerId, distinctQueue)
    }
    else{
      draftEmitter.EmitQueueFail(data.ownerId,data.teamId)
    }
  }

  this.SetQueue = (socketId, queue) => {
    that.owners.SetQueue(socketId, queue)
  }

  this.ProcessMessage = (socketId, data) => {
    data.ownerId = that.owners.GetOwnerIdFromSocketId(socketId)
    socketIoHelpers.InsertDraftAction(
      roomId, data.ownerId, 'MESSAGE', {message:data.message}, data.clientTs)
    draftEmitter.EmitMessage(data)
  }

  this.Timeout = (amountOfTime) =>
  {
    console.log('in timeout')
    clearTimers()
    socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'timeout'})
    draftEmitter.EmitModeChange('timeout')
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
    console.log(1,roomId)
    draftIsUp = true
    let counter = 0
    clearTimers()
    that.timer = setInterval(() => {
      console.log(roomId, that.time, counter)
      if(that.time < counter){
        clearInterval(that.timer)
        draftEmitter.EmitDraftLive()
        socketIoHelpers.InsertDraftAction(roomId, 'server', 'STATE', {'mode':'live'})
        waitToAutoDraft(timeToDraft)
        return
      }
      counter += 1000

      //console.log('counting in start draft', that.time, counter)

      draftEmitter.EmitStartTick()
    }, 1000)
  }

  const waitToAutoDraft = (timeOnClock) => {
    if(that.pick >= that.totalPicks)
    {
      this.EndDraft()
    }
    else{
      that.counter = timeOnClock
      clearTimers()
      draftEmitter.EmitDraftTick(that.counter)
    
      that.timer = setInterval(() => {
        if(that.counter === 0){
          clearInterval(that.timer)
          const ownerId = getCurrentOwnerId()
          const teamId = getAutoDraftTeam(ownerId)
          let draftResult = that.owners.TryDraft(ownerId,teamId, that.pick)

          draftTeam(ownerId,teamId, draftResult)
          return
        }
        that.counter -= 1
        draftEmitter.EmitDraftTick(that.counter)
        console.log('counting in autodraft')
        
      }, 1000)
    }
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

    draftEmitter.EmitDraftTeam(teamId,ownerId,draftResult.queue,draftResult.eligibleTeams)

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
    draftEmitter.EmitModeChange('live')
    waitToAutoDraft(that.counter)
  }
}

module.exports = DraftManager
const draftHelpers = require('../../routes/helpers/draftHelpers')
const fantasyHelpers = require('../../routes/helpers/fantasyHelpers')
const socketIoHelpers = require('../socketioHelpers')
const Owners = require('./Owners')
const C = require('../../../common/constants')

function DraftManager(roomId, draftEmitter) {
  
  var that = this
  let timeToDraft = 5
  var draftIsUp = false
  let draftState = 'pre'
 
  this.Create = async (socketMap = {}) =>
  {
    const resp = await socketIoHelpers.GetDraftInfo(roomId)
    timeToDraft = resp.seconds_pick
    draftState = resp.draftState
    that.draftPosition = resp.draft_position
    that.draftOrder =  fantasyHelpers.GetDraftOrder(resp.total_teams,resp.draft_position.length)
    that.allTeams = Array.from(resp.allTeamsByRank)
    that.time = new Date(resp.start_time)- new Date()
    that.totalPicks = resp.totalPicks
    that.leagueId = resp.league_id
    that.owners = new Owners(socketMap)
    await that.owners.CreateOwners(resp.owners, resp.queueByOwner, roomId, resp.allTeamsByRank)
    that.counter = timeToDraft
  }

  this.DraftIsUp = () => {
    return draftIsUp
  }

  this.Start = async () =>
  {
    that.pick = 0
    console.log(roomId, 'is online')
    draftEmitter.EmitWhosHere()
    await waitToStartDraft()
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
    draftState = C.DRAFT_STATE.POST
    socketIoHelpers.InsertDraftState(roomId,draftState)
    draftEmitter.EmitModeChange(draftState)
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
    draftState = 'pre'
    await waitToStartDraft()
  }

  this.SetTimeToDraft = async (inpTimeToDraft) =>
  {
    timeToDraft = inpTimeToDraft
  }

  this.DraftedTeamFromClient = (socketId, data) => { 
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
    draftState = C.DRAFT_STATE.TIMEOUT
    clearTimers()
    socketIoHelpers.InsertDraftState(roomId,draftState)
    draftEmitter.EmitModeChange(draftState)
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

  const onStartDraft = async () => {
    let socketMap = this.owners.SocketMap()
    await this.Create(socketMap)
    socketIoHelpers.GetDraftResults(roomId)
      .then((results) => {
        that.pick = that.owners.GetCurrPickAndUpdateDraftOnStart(results)
        draftEmitter.EmitDraftLive()
        waitToAutoDraft(timeToDraft)
      })

  }

  const waitToStartDraft = async () => {
    draftIsUp = true
    let counter = 0
    
    clearTimers()

    if (draftState === C.DRAFT_STATE.LIVE)
    {
      await onStartDraft()
    }
    else 
    {
      that.timer = setInterval(async () => {
        if(that.time < counter){
          clearInterval(that.timer)
          draftState = C.DRAFT_STATE.LIVE
          socketIoHelpers.InsertDraftState(roomId, draftState)
          await onStartDraft()
          return
        }
        counter += 1000

        draftEmitter.EmitStartTick()
      }, 1000)
    }
  }

  const waitToAutoDraft = (timeOnClock) => {
    if(that.pick >= that.totalPicks)
    {
      this.EndDraft()
    }
    else{
      that.counter = timeOnClock
      clearTimers()
      draftEmitter.EmitDraftTick(that.counter, that.pick)
      that.timer = setInterval(async () => {
        if(that.counter === 0){
          clearInterval(that.timer)
          const ownerId = getCurrentOwnerId()
          const teamId = getAutoDraftTeam(ownerId)
          //comes back with information to ppick for the team
          let draftResult = that.owners.TryDraft(ownerId,teamId, that.pick)

          await draftTeam(ownerId,teamId, draftResult)
          return
        }
        that.counter -= 1
        draftEmitter.EmitDraftTick(that.counter, that.pick)        
      }, 1000)
    }
  }

  //the team id needs to be verified before this function is hit.
  const draftTeam = async (ownerId, teamId, draftResult, clientTs = undefined) =>{
    
    if(await canOwnerDraftTeam(ownerId, that.pick))
    {
      const localPick = getThenIncrementPick() 

      socketIoHelpers.InsertDraftAction(
        roomId, ownerId, 'PICK', {pick:localPick, teamId:teamId},clientTs)

      that.owners.DraftTeam(ownerId, draftResult)
      that.owners.RemoveTeam(teamId)

      console.log(localPick, teamId, ownerId)

      socketIoHelpers.InsertDraftAction(
        roomId, ownerId, 'QUEUE', {queue:draftResult.queue})

      draftEmitter.EmitDraftTeam(teamId,ownerId,draftResult.queue,draftResult.eligibleTeams)

      waitToAutoDraft(timeToDraft)
    }
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

  const canOwnerDraftTeam = async (ownerId, pick) => 
  {
    let pickIsntInDb = await socketIoHelpers.CheckDraftBeforeInsertingPick(roomId, pick)
    if(pickIsntInDb === false)
    {
      console.log('cant draft already in db')
      return false
    }
    if (ownerId !== that.draftPosition[that.draftOrder.find(x => x.pick === pick).ownerIndex])
    {
      console.log('cant draft, not your turn')
      return false
    }
    return true
  }

  const clearTimers = () => {
    clearInterval(that.timer)
    clearTimeout(that.timer)
  }

  const timeIn = () => {
    draftState = C.DRAFT_STATE.LIVE
    socketIoHelpers.InsertDraftState(roomId, draftState)
    draftEmitter.EmitModeChange(draftState)
    waitToAutoDraft(that.counter)
  }
}

module.exports = DraftManager
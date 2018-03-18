const draftHelpers = require('../routes/helpers/draftHelpers')
const socketIoHelpers = require('./socketioHelpers')

function DraftManager(roomId) {
  
  this.roomId = roomId
  //var pick =  (() => {let count = 0; return () => {return count++}})()
  var pick = 0
  var timer
  var that = this
  var timeToDraft = 5
 
  this.Create = async () =>
  {
    const res = await socketIoHelpers.GetDraftInfo(this.roomId)
    that.draftPosition = res.draft_position,
    that.draftOrder =  draftHelpers.GetDraftOrder(res.total_teams,res.draft_position.length),
    that.availableTeams=  res.availableTeams
    that.allTeams = Array.from(res.availableTeams)
    that.time = new Date(res.start_time)- new Date()
  }

  this.TimeUntilStart = () =>
  {
    return that.time
  }

  this.Clear = () =>
  {
    clearInterval(timer)
    clearTimeout(timer)
  }

  this.WaitToStartDraft = (emitStartTick, startDraft,  emitDraftTick, sendDraftInfo) =>
  {
    let counter = 0
    this.Clear()
    timer = setInterval(() => {
      if(that.time < counter){
        clearInterval(timer)
        startDraft(this.roomId)
        this.WaitToAutoDraft(emitDraftTick, sendDraftInfo)
        return
      }
      counter += 1000

      console.log('counting in start draft', that.time, counter)

      emitStartTick(this.roomId)
    }, 1000)
  }

  this.WaitToAutoDraft = (emitDraftTick, sendDraftInfo) =>
  {
    let counter = timeToDraft
    this.Clear()
    emitDraftTick(this.roomId, counter)
  
    timer = setInterval(() => {
      if(counter === 0){
        clearInterval(timer)
        const teamId = this.GetAutoDraftTeam()
        const ownerId = this.GetCurrentOwnerId()
        const localPick = this.GetThenIncrementPick()
        console.log(localPick, teamId, ownerId)
        sendDraftInfo(roomId, teamId, ownerId)
        this.WaitToAutoDraft(emitDraftTick, sendDraftInfo)
        return
      }
      counter -= 1
      emitDraftTick(this.roomId, counter)
      console.log('counting in autodraft')
      
    }, 1000)
  }

  this.GetThenIncrementPick = ()  =>
  {
    pick++
    return pick -1  
  }

  this.GetAutoDraftTeam = () =>
  {
    return this.availableTeams.shift()
  }

  this.GetCurrentOwnerId = () =>
  {
    return this.draftPosition[this.draftOrder[pick].ownerIndex]
  }

  this.StartAgain = (time) =>
  {
    pick = 0
    that.time = time
    this.availableTeams = Array.from(this.allTeams)
  }

  this.DraftedTeam = (teamId) =>
  {
    const index = this.availableTeams.indexOf(teamId)
    if(index > -1)
    {
      this.availableTeams.splice(index, 1)
      console.log(teamId,' removed')
    }
  }
}

module.exports = DraftManager
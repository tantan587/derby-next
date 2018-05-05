const Owner = require('./Owner')
const socketIoHelpers = require('../socketioHelpers')

function Owners() {
  
  var owners = {}
  var socketOwnerMap = {}
  var draftRules
  var teamMap
  
  this.CreateOwners = async (ownerIds, queueByOwner, roomId, allTeams) =>
  {
    draftRules = await socketIoHelpers.GetDraftRules(roomId)
    teamMap = await socketIoHelpers.GetTeamMap(roomId)
    ownerIds.map(x => owners[x] = 
      new Owner(x, JSON.parse(JSON.stringify(draftRules)), [].concat(allTeams)))
    Object.keys(queueByOwner).map(x => 
      owners[x].SetQueue(queueByOwner[x]))
  }

  this.GetOwnerIdFromSocketId = (socketId) => {
    return socketOwnerMap[socketId]
  }

  this.ResetEligible = () => {
    Object.values(owners).forEach(owner => owner.ResetEligible())
  }

  this.SetQueue = (socketId, newQueue) =>{
    owners[socketOwnerMap[socketId]].SetQueue(newQueue)
  }

  this.TryUpdateQueue = (data) =>
  {
    return owners[data.ownerId].TryUpdateQueue(data.teamId)
  }

  this.GetNextTeam = (ownerId) =>
  {
    return owners[ownerId].GetNextTeam()
  }

  this.TryDraft = (ownerId, teamId) =>
  {
    let confId = teamMap[teamId].conference_id
    let sportId = teamMap[teamId].sport_id
    let teamsInConf = teamMap[confId]
    let teamsInSport = teamMap[sportId]
    return owners[ownerId].TryDraft(sportId,confId,teamId, teamsInSport, teamsInConf)
  }

  this.RemoveTeam = (teamId) =>
  {
    Object.values(owners).map(x => x.RemoveTeam(teamId))
  }

  this.WhoIsInDraft = () =>
  {
    return Object.values(owners).filter(x =>
      x.InRoomInd() === true).map(x => x.ownerId)
  }

  this.Joined = (socketId,ownerId) =>
  {
    socketOwnerMap[socketId] = ownerId
    console.log('hello', owners, ownerId, 'goodbye')
    owners[ownerId].Joined()
  }

  this.Left = (socketId) =>
  {
    owners[socketOwnerMap[socketId]].Left()
    delete socketOwnerMap[socketId]

  }

}

module.exports = Owners
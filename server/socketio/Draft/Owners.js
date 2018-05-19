const Owner = require('./Owner')
const draftHelpers = require('../../routes/helpers/draftHelpers')

function Owners() {
  
  var owners = {}
  var socketOwnerMap = {}
  var draftRules
  var teamMap
  
  this.CreateOwners = async (ownerIds, queueByOwner, roomId, allTeams) =>
  {
    draftRules = await draftHelpers.GetDraftRules(roomId)
    teamMap = await draftHelpers.GetTeamMap(roomId)
    ownerIds.map(x => owners[x] = 
      new Owner(x, JSON.parse(JSON.stringify(draftRules)), [].concat(allTeams), teamMap))
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

  this.TryDraft = (ownerId, teamId, pick) =>
  {
    return owners[ownerId].TryDraft(teamId,pick)
  }

  this.RemoveTeam = (teamId) =>
  {
    Object.values(owners).map(x => x.RemoveTeam(teamId))
  }

  this.AssembleTeams = () =>{
    return Object.keys(owners).map(x => {
      return owners[x].AssembleTeams().map(team => {
        return {...team, owner_id:x}})}).reduce((x,y) => {return x.concat(y)})
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
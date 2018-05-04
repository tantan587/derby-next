const Owner = require('./Owner')
const socketIoHelpers = require('../socketioHelpers')

function Owners() {
  
  var owners = {}
  var socketOwnerMap = {}
  var draftRules
  var teamMap
  
  this.CreateOwners = async (ownerIds, queueByOwner, roomId) =>
  {
    draftRules = socketIoHelpers.GetDraftRules(roomId)
    teamMap = await socketIoHelpers.GetTeamMap(roomId)
    ownerIds.map(x => owners[x] = new Owner(x, JSON.parse(JSON.stringify(draftRules))))
    Object.keys(queueByOwner).map(x => 
      owners[x].UpdateQueue(queueByOwner[x]))
  }

  this.GetOwnerIdFromSocketId = (socketId) => {
    return socketOwnerMap[socketId]
  }

  this.UpdateQueue = (socketId, newQueue) =>
  {
    console.log(socketOwnerMap)
    owners[socketOwnerMap[socketId]].UpdateQueue(newQueue)
  }

  this.GetNextInQueue = (ownerId) =>
  {
    return owners[ownerId].GetNextInQueue()
  }

  this.Draft = (ownerId, teamId) =>
  {
    let confId = teamMap[teamId].conference_id
    let sportId = teamMap[teamId].sport_id
    return owners[ownerId].TryDraft(sportId,confId,teamId)
  }

  this.RemoveFromAllQueues = (teamId) =>
  {
    Object.values(owners).map(x => x.RemoveFromQueue(teamId))
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
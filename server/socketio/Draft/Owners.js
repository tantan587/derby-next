const Owner = require('./Owner')

function Owners(ownerIds, queueByOwner) {
  
  var owners = {}
  var socketOwnerMap = {}
  ownerIds.map(x => owners[x] = new Owner(x))
  Object.keys(queueByOwner).map(x => 
    owners[x].UpdateQueue(queueByOwner[x]))

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
    owners[ownerId].Joined()
  }

  this.Left = (socketId) =>
  {
    owners[socketOwnerMap[socketId]].Left()
    delete socketOwnerMap[socketId]

  }

}

module.exports = Owners
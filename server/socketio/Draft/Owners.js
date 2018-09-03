const Owner = require('./Owner')
const draftHelpers = require('../../routes/helpers/draftHelpers')

function Owners(socketMap) {
  
  var owners = {}
  var socketOwnerMap = socketMap
  var draftRules
  var teamMap
  
  this.CreateOwners = async (ownerIds, queueByOwner, roomId, allTeamsByRank) =>
  {
    draftRules = await draftHelpers.GetDraftRules(roomId)
    teamMap = await draftHelpers.GetTeamMap(roomId)
    ownerIds.map(x => owners[x] = 
      new Owner(x, JSON.parse(JSON.stringify(draftRules)), [].concat(allTeamsByRank), teamMap))
    Object.keys(queueByOwner).map(x => 
      owners[x].SetQueue(queueByOwner[x]))
  }

  this.SocketMap = () => {
    return socketOwnerMap
  }

  this.GetCurrPickAndUpdateDraftOnStart = results =>
  {
    let pick = -1
    let resultsToEnter = []
    results.forEach(element => {
      
      if(element.action_type == 'PICK')
      {
        resultsToEnter.push({
          pick:element.action.pick,
          ownerId:element.initiator,
          teamId:element.action.teamId
        })
      }
      else if(element.action_type == 'ROLLBACK')
      {
        resultsToEnter.splice(-1,1)
      }
    })

    resultsToEnter.forEach(x => {
      pick = x.pick
      let draftData = this.TryDraft(x.ownerId, x.teamId,x.pick)
      this.DraftTeam(x.ownerId, draftData)
      this.RemoveTeam(x.teamId)
    })
    return pick + 1
    
  }

  this.GetOwnerIdFromSocketId = (socketId) => {
    return socketOwnerMap[socketId]
  }

  this.ResetEligible = () => {
    Object.values(owners).forEach(owner => owner.ResetEligible())
  }

  this.SetQueue = (socketId, newQueue) =>{
    if(owners[socketOwnerMap[socketId]])
      owners[socketOwnerMap[socketId]].SetQueue(newQueue)
    else
    {
      console.log('nope')
    }
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
  {//note i am doing pick+1 because the db needs to index at 1 not 0
    return owners[ownerId].TryDraft(teamId,pick+1)
  }

  this.DraftTeam = (ownerId, draftData) =>
  {
    return owners[ownerId].DraftTeam(draftData)
  }

  this.UndraftTeam = (ownerId, pick) =>
  {
    //note i am doing pick+1 because the db needs to index at 1 not 0
    let teamId = owners[ownerId].UndraftTeam(pick+1)
    Object.values(owners).forEach(x => x.UndoLastPick())
    let eligibleTeams = owners[ownerId].GetEligible()
    return {ownerId, teamId, eligibleTeams}
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
    owners[ownerId].Joined()
  }

  this.Left = (socketId) =>
  {
    if(owners[socketOwnerMap[socketId]])
    {
      owners[socketOwnerMap[socketId]].Left()
      delete socketOwnerMap[socketId]
    }

  }

}

module.exports = Owners
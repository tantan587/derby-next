const draftHelpers = require('../../routes/helpers/draftHelpers')
const League = require('../../source/League.ts')

function Owner(ownerId, draftRules, allTeamsByRank, teamMap) {
  this.ownerId = ownerId
  var autoDraft = false
  var queue = []
  var pickToTeamsMap = []
  var drafted = []
  var here = false
  var eligibleTeams = [].concat(allTeamsByRank)
  var theDraftRules = JSON.parse(JSON.stringify(draftRules))
  var ok = new League('hello')
  
  this.TryUpdateQueue = (teamId) =>
  {
    if(eligibleTeams.includes(teamId) && !queue.includes(teamId))
    {
      queue.push(teamId)
      return true
    }
    return false
  }

  this.SetQueue = (newQueue) =>
  {
    queue = [].concat(newQueue)
  }
  
  this.ResetEligible = () =>
  {
    eligibleTeams = [].concat(allTeamsByRank)
    theDraftRules = JSON.parse(JSON.stringify(draftRules))
  }

  this.GetNextTeam = () =>
  {
    return queue.length > 0 ? queue[0] : eligibleTeams[0]
  }
  this.RemoveTeam = (teamId) =>
  {
    //console.log('q:', queue.length, 'e:',  eligibleTeams.length, eligibleTeams[0], this.ownerId)
    const index =queue.indexOf(teamId)
    if(index > -1)
    {
      queue.splice(index, 1)
    }
    const index2 = eligibleTeams.indexOf(teamId)
    if(index2 > -1)
    {
      eligibleTeams.splice(index2,1)
    }
    drafted.push(teamId)
  }

  this.DraftTeam = (draftData) => {
    updatePick(draftData)
    updateEligible(draftData)
  }

  this.ToggleAutoDraft = (value) => {
    if(typeof value === 'undefined')
      autoDraft = !autoDraft
    else{
      autoDraft = value
    }
  }

  this.GetAutoDraft = () => {
    return autoDraft
  }

  const updateEligible = (draftData) => {
    eligibleTeams = draftData.eligibleTeams
    queue = draftData.queue
  }

  const updatePick = (draftData) => {
    pickToTeamsMap[draftData.pickInfo.overall_pick] = draftData.pickInfo.team_id
  }

  this.TryDraft = (teamId,pick) =>{
    let resp = draftHelpers.FilterDraftPick(teamId, teamMap, theDraftRules, eligibleTeams, queue)
    if(resp)
    {
      resp.pickInfo = {team_id:teamId, overall_pick:pick}
    }
    return resp
  }

  this.UndraftTeam = (pick) => {
    let teamId = pickToTeamsMap[pick]
    delete pickToTeamsMap[pick]
    return teamId
  }

  this.UndoLastPick = () => {

    drafted.splice(-1,1)
    this.ResetEligible()
    Object.keys(pickToTeamsMap).forEach(p => {
      let resp = this.TryDraft(pickToTeamsMap[p],p)
      updateEligible(resp)
    })

    drafted.forEach(x => {
      let index = eligibleTeams.indexOf(x)
      if(index > -1)
      {
        eligibleTeams.splice(index,1)
      }
    })
  }

  this.GetEligible = () => {
    return eligibleTeams
  }


  this.AssembleTeams = () =>{
    return Object.keys(pickToTeamsMap).map(pick => {return {overall_pick:pick, team_id:pickToTeamsMap[pick]}})
  }

  this.Joined = () =>
  {
    here = true
  }


  this.Left = () =>
  {
    here = false
  }

  this.InRoomInd = () =>
  {
    return here
  }

}

module.exports = Owner
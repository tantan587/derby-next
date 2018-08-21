const draftHelpers = require('../../routes/helpers/draftHelpers')

function Owner(ownerId, draftRules, allTeamsByRank, teamMap) {
  this.ownerId = ownerId

  // const shuffle = (array) => {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     let j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]]
  //   }
  // }

  var queue = []
  var teams = []
  var here = false
  //shuffle(allTeamsByRank)
  var eligibleTeams = [].concat(allTeamsByRank)
  var theDraftRules = JSON.parse(JSON.stringify(draftRules))
  
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
    console.log('q:', queue.length, 'e:',  eligibleTeams.length, eligibleTeams[0], this.ownerId)
    const index =queue.indexOf(teamId)
    if(index > -1)
    {
      queue.splice(index, 1)
    }
    const index2 =eligibleTeams.indexOf(teamId)
    if(index2 > -1)
    {
      eligibleTeams.splice(index2, 1)
    }    
  }

  this.DraftTeam = (draftData) => {
    teams.push(draftData.pickInfo)
    eligibleTeams = draftData.eligibleTeams
    queue = draftData.queue
  }

  this.TryDraft = (teamId,pick) =>{
    let resp = draftHelpers.FilterDraftPick(teamId, teamMap, theDraftRules, eligibleTeams, queue)
    if(resp)
    {
      resp.pickInfo = {team_id:teamId, overall_pick:pick+1}
    }
    return resp
  }

  this.AssembleTeams = () =>{
    return teams.map(x => {return x})
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
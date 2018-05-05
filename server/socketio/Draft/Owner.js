function Owner(ownerId, draftRules, allTeams) {
  this.ownerId = ownerId

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  var queue = []
  var teams = []
  var here = false
  shuffle(allTeams)
  var eligibleTeams = [].concat(allTeams)
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
    eligibleTeams = [].concat(allTeams)
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

  this.TryDraft = (sportId,confId,teamId,teamsInSport, teamsInConf) =>{
    let sport = theDraftRules[sportId]
    let conf = sport.conferences[confId]
    if(eligibleTeams.includes(teamId))
    {
      teams.push(teamId)
      sport.total++
      conf.total++
      sport.total === sport.max ?
        filterdownEligibleTeams(teamsInSport) :
        conf.total === conf.max ?
          filterdownEligibleTeams(teamsInConf) :
          () => {}
      return true
    }
    return false
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

  const filterdownEligibleTeams = (teams) =>
  {
    eligibleTeams = eligibleTeams.filter(team => {
      return !teams.includes(team)
    })
  }
}

module.exports = Owner
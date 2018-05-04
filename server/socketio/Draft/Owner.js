function Owner(ownerId, draftRules) {
  
  this.ownerId = ownerId
  var queue = []
  var teams = []
  var here = false
  
  this.UpdateQueue = (newQueue) =>
  {
    queue = Array.from(newQueue)
  }
  this.GetNextInQueue = () =>
  {
    return queue.length > 0 ? queue[0] : null
  }
  this.RemoveFromQueue = (teamId) =>
  {
    const index =queue.indexOf(teamId)
    if(index > -1)
    {
      queue.splice(index, 1)
    }
  }

  this.TryDraft = (sportId,confId,teamId) =>{
    let sport = draftRules[sportId]
    let conf = sport.conferences[confId]
    if(sport.total < sport.max && 
      conf.total < conf.max)
    {
      teams.push(teamId)
      sport.total++
      conf.total++
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
}

module.exports = Owner
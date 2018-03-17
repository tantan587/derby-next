function ServerDraftInfo(draftPosition, draftOrder, availableTeams) {
  
  //var pick =  (() => {let count = 0; return () => {return count++}})()
  var pick = 0
  this.draftPosition = draftPosition
  this.draftOrder = draftOrder
  this.availableTeams = availableTeams
  this.allTeams = Array.from(availableTeams)

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

  this.StartAgain = () =>
  {
    pick = 0
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

module.exports = ServerDraftInfo
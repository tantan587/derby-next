function Owner(ownerId) {
  
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
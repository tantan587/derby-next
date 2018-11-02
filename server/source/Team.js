
//const Record = require('./Record')

class Team {
  constructor(inpTeamId, todaysDayCount) {
    this.Schedule = []
    this.today = todaysDayCount
    this.teamId =inpTeamId
  }

  GetRecord() {
    return this.today
  }

}

module.exports = Team


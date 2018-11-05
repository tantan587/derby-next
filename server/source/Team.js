
//const Record = require('./Record')

class Team {
  constructor(teamId, city, name, schedule) {
    this.Schedule = schedule
    this.City = city
    this.Name = name
    this.TeamId =teamId
  }

  GetRecord() {
    return this.today
  }

}

module.exports = Team



//const Record = require('./Record')

class Team {
  constructor(sportId, teamId, city, name, schedule) {
    this.Schedule = schedule
    this.City = city
    this.Name = name
    this.Id =teamId
    this.SportId = sportId
  }

  GetRecord() {
    return this.Schedule.Record()
  }

  GetLastWeekRecord() {
    return this.Schedule.Record(0, 7)
  }

  GetUpToLastWeekRecord() {
    return this.Schedule.Record(7)
  }

}

module.exports = Team


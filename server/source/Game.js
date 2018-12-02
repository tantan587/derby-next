const Record = require('./Record')

class Game {

  constructor(dataRow, teamId) {
    this.GameId = dataRow.global_game_id
    this.AwayTeamId = dataRow.away_team_id
    this.HomeTeamId = dataRow.home_team_id
    this.DateTime = dataRow.date_time
    this.DayCount = dataRow.day_count
    this.SportId = dataRow.sport_id
    this.GameResult = {}
    this.Status = dataRow.status
    this.TeamId = teamId
    this.Winner = dataRow.winner
  }

  Outcome() {
    if (this.Winner === '---')
      return new Record()
    else if (this.Winner === 'T')
      return new Record(0,0,1)
    else if ((this.Winner === 'H' && this.TeamId === this.HomeTeamId) ||
      (this.Winner === 'A' && this.TeamId === this.AwayTeamId))
      return new Record(1,0,0)
    else 
      return new Record(0,1,0)
  }
}
module.exports = Game
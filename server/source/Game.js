

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
      return Game.Result.NP
    else if (this.Winner === 'T')
      return Game.Result.Tie
    else if ((this.Winner === 'H' && this.TeamId === this.HomeTeamId) ||
      (this.Winner === 'A' && this.TeamId === this.AwayTeamId))
      return Game.Result.Win
    else 
      return Game.Result.Loss
  }
}
Game.Result = {Win:'W', Loss:'L', Tie:'T', NP:'NP'}
module.exports = Game
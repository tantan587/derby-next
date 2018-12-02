
class Record {
  constructor(wins = 0, losses = 0, ties = 0) {
    this.Wins = wins
    this.Losses = losses
    this.Ties = ties
  }

  AddOutcome(record){
    this.Wins += record.Wins
    this.Ties += record.Ties
    this.Losses += record.Losses
  }

}
module.exports = Record
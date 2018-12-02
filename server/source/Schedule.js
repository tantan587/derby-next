const DayCountCreator = require('./DayCountCreator')

class Schedule {
  constructor(games) {
    this.Games = games
  }

  Record(daysBack) {
    if (typeof daysBack === 'undefined')
      daysBack = 365

    let dayCountCreator = new DayCountCreator()
    let todaysDayCount =  dayCountCreator.GetDayCountByDate(new Date())
    

    return this.Games.filter(game => {
      return game.DayCount <= todaysDayCount && game.DayCount > (todaysDayCount - daysBack)
    })
      .reduce((tally, game) => {
        let outcome = game.Outcome()
        tally[outcome] = (tally[outcome] || 0) + 1
        return tally
      } , {})
  }
}
module.exports = Schedule
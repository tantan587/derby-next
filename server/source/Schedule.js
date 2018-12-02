const DayCountCreator = require('./DayCountCreator')
const Record = require('./Record')

class Schedule {
  constructor(games) {
    this.Games = games
  }

  Record(endDateDaysBack = 0, startDatedaysBack = 365) {

    let dayCountCreator = new DayCountCreator()
    let todaysDayCount =  dayCountCreator.GetDayCountByDate(new Date())
    

    return this.Games.filter(game => {
      return game.DayCount <= (todaysDayCount - endDateDaysBack) && 
      game.DayCount > (todaysDayCount - startDatedaysBack)
    })
      .reduce((overall, game) => {
        overall.AddOutcome(game.Outcome())
        return overall
      } , new Record())
  }
}
module.exports = Schedule
const script1 = require('../scripts/updatePlayoffsSchedule')
const script2 = require('../scripts/updateSchedule')
const script3 = require('../scripts/updatePlayoffStandings')
const script4 = require('../scripts/updateStandings')
const script5 = require('../scripts/updateDayOfSchedule')
const scriptPoints = require('../scripts/updateFantasyPointsOnly')



const everyMinute = async () => {
  await script1.createSchedule()
  await script2.createSchedule()
  await script3.createStandingsPO()
  await script4.updateStandings()
  await script5.updateBoxScoreJSON(false, 'near')
  await scriptPoints.updatePoints()
}

setInterval(async () => await everyMinute(), 60000)

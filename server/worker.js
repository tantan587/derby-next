const script1 = require('../scripts/updatePlayoffsSchedule')
const script2 = require('../scripts/updateSchedule')
const script3 = require('../scripts/updatePlayoffStandings')
const script4 = require('../scripts/updateStandings')
const script5 = require('../scripts/updateDayOfSchedule')


const everyMinute = async () => {
  await script1.createSchedule(false)
  await script2.createSchedule(false)
  await script3.createStandingsPO(false)
  await script4.updateStandings(false)
  await script5.updateBoxScoreJSON(true, 'near')
}

setInterval(async () => await everyMinute(), 10000)



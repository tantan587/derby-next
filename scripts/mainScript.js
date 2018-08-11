const script1 = require('./updatePlayoffsSchedule')
const script2 = require('./updateSchedule')
const script3 = require('./updatePlayoffStandings')
const script4 = require('./updateStandings')
const script5 = require('./tableReset')
const script6 = require('./createSports/createAllSports')
const asyncForEach = require('./asyncForEach')

const runUpdate = async () => {
  await asyncForEach(process.argv, async (val,i) => {
    console.log('next script: '  +val)
    let exitProcessInd = process.argv.length-1 === i
    switch (val) {
    case 'reset':
    {
      await script5.resetTables(exitProcessInd)
      break
    }
    case 'allSports':
    {
      await script6.createSports(exitProcessInd)
      break
    }
    case '1':
    {
      await script1.createSchedule(exitProcessInd)
      break
    }
    case '2':
    {
      await script2.createSchedule(exitProcessInd)
      break
    }
    case '3':
    {
      await script3.createStandingsPO(exitProcessInd)
      break
    }
    case '4':
    {
      await script4.updateStandings(exitProcessInd)
      break
    }
    default:
    {
      break
    }}
  })
}

runUpdate()

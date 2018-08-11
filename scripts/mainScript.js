const script1 = require('./updatePlayoffsSchedule')
const script2 = require('./updateSchedule')
const script3 = require('./updatePlayoffStandings')
const script4 = require('./updateStandings')
const script5 = require('./updateDayOfSchedule')
const scriptReset = require('./tableReset')
const scriptAll = require('./createSports/createAllSports')
const asyncForEach = require('./asyncForEach')

const runUpdate = async () => {
  await asyncForEach(process.argv, async (val,i) => {
    console.log('next script: '  +val)
    let exitProcessInd = process.argv.length-1 === i

    let arr = val.split('=')

    switch (arr[0]) {
    case 'reset':
    {
      await scriptReset.resetTables(exitProcessInd)
      break
    }
    case 'allSports':
    {
      await scriptAll.createSports(exitProcessInd)
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
    //'active':
    //'near':
    //'previous',102 
    //'specific',1634
    case '5':
    {
      await script5.updateBoxScoreJSON(exitProcessInd, arr[1])
      break
    }
    default:
    {
      break
    }}
  })
}

runUpdate()

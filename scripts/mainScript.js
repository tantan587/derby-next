const script1 = require('./updatePlayoffsSchedule')
const script2 = require('./updateSchedule')
const script3 = require('./updatePlayoffStandings')
const script4 = require('./updateStandings')
const script5 = require('./updateDayOfSchedule')
const scriptReset = require('./tableReset')
const scriptSimulate = require('./Analysis/simulation')
const scriptAll = require('./createSports/createAllSports')
const scriptPoints = require('./updateFantasyPointsOnly')
const asyncForEach = require('./asyncForEach')
const scriptAfterSeasonElos = require('./Analysis/adjustElosAfterSeason')
const updateElos = require('./Analysis/updateElo')
const updateEplElos = require('./Analysis/updateEloEPL')
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')

const runUpdate = async () => {
  await asyncForEach(process.argv, async (val,i) => {
    console.log('next script: '  +val)
    let exitProcessInd = process.argv.length-1 === i

    let arr = val.split('=')

    switch (arr[0]) {
    case 'reset':
    {
      await scriptReset.resetTables()
      await scriptAll.createSports()
      await script1.createSchedule(false, true)
      await script2.createSchedule(false, true)
      await script3.createStandingsPO(false, true)
      await script4.updateStandings(false, true)
      // await asyncForEach([101,102,103,104,105,106,107], async (sport_id) => {
      //   await script5.updateBoxScoreJSON(false, ['previous', sport_id])
      // })
      await scriptPoints.updatePoints(false, true)
      
      await scriptAfterSeasonElos.adjustElosAfterSeason(false,'all')
      //this is used to build projections for first time - needs to be set to true once
      await scriptSimulate.simulate(exitProcessInd, 10, true)
      break
    }
    case 'allSports': 
    {
      await scriptAll.createSports(exitProcessInd)
      break
    }

    case 'simulate':
    {
      await scriptSimulate.simulate(exitProcessInd,arr[1])
      break
    }

    case 'playoff_schedule': //playoff schedule
    {
      await script1.createSchedule(exitProcessInd)
      break
    }
    case 'schedule': //regular schedule
    {
      await script2.createSchedule(exitProcessInd)
      break
    }
    case 'playoff_standings':
    {
      await script3.createStandingsPO(exitProcessInd)
      break
    }
    case 'standings':
    {
      await script4.updateStandings(exitProcessInd)
      break
    }
    //'active':
    //'near':
    //'previous',102 
    //'specific',1634
    case 'deep':
    {
      await script5.updateBoxScoreJSON(exitProcessInd, arr[1])
      break
    }

    case 'points': {
      await scriptPoints.updatePoints(exitProcessInd)
      break
    }

    //'all': to set all elos after Season
    case 'afterSeasonElos': {
      await scriptAfterSeasonElos.adjustElosAfterSeason(exitProcessInd, arr[1])
      break
    }

    //currently set to update epl, and regular. 
    case 'elo': {
      await updateEplElos.updateEplElo()
      await updateElos.updateElos(exitProcessInd)
      break
    }

    case 'deleteLeague': {
      await fantasyHelpers.DeleteLeague(exitProcessInd, arr[1])
      break
    }
    default:
    {
      break
    }}
  })
}

runUpdate()

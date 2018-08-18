const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')

const updatePoints = async (exitProcess, all) => {
  await fantasyHelpers.updateTeamPoints(all)
  await fantasyHelpers.updateLeaguePoints()
  console.log('im done')
  if(exitProcess)
    process.exit()
}

module.exports = {updatePoints}
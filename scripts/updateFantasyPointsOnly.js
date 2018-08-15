const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')

const updatePoints = async (exitProcess) => {
await fantasyHelpers.updateTeamPoints()
await fantasyHelpers.updateLeaguePoints()
console.log('im done')
if(exitProcess)
  process.exit()
}

module.exports = {updatePoints}
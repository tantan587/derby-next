
const DraftLobby = require('./Draft/DraftLobby')
const SportsLobby = require('./Sports/SportsLobby')

const startSocketIo = async (io) =>
{
  let draftLobby = new DraftLobby(io)
  await draftLobby.Create()
  draftLobby.Activate()

  let sportsLobby = new SportsLobby(io)
  await sportsLobby.Create()
  sportsLobby.Activate()
}

module.exports = {
  startSocketIo
}

const DraftLobby = require('./Draft/DraftLobby')

const startSocketIo = async (io) =>
{
  let draftLobby = new DraftLobby(io)
  await draftLobby.Create()
  draftLobby.Activate()
}

module.exports = {
  startSocketIo
}
//const socketIoHelpers = require('../socketioHelpers')
const SportsManager = require('./SportsManager')
//const SportsEmitter = require('./SportsEmitter')

class SportsLobby {
  constructor(io)
  {
    this.sportsNSP = io.of('/sports')
    this.sportRoom = {}
  }

  async Create() {

    this.sportRoom.Manager = new SportsManager(this.sportsNSP)
  }

  async Activate() {

    this.sportRoom.Manager.Create()
    this.sportsNSP.on('connection', socket => 
    { 
      this.SportsListener(socket)
    })
  }

  SportsListener(socket) {

    socket.on('teamUpdateTime', () =>
    {
      this.sportsNSP.to(socket.id).emit('serverTeamUpdateTime', this.sportRoom.Manager.TeamInfoUpdateTime)
    })

    socket.on('gameUpdateTime', () =>
    {
      this.sportsNSP.to(socket.id).emit('serverGameUpdateTime', this.sportRoom.Manager.GameInfoUpdateTime)
    })

    socket.on('allTeamData', async (sportSeasons) =>
    {
      let teamInfo = await this.sportRoom.Manager.TeamInfoBySportsSeason(sportSeasons)
      this.sportsNSP.to(socket.id).emit('serverAllTeamData', teamInfo)
    })
    
    socket.on('allGameData', () =>
    {
      this.sportsNSP.to(socket.id).emit('serverAllGameData', this.sportRoom.Manager.GameInfo)
    })
  }
}

module.exports = SportsLobby
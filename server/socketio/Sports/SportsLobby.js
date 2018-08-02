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

    //turning this off for now
    // socket.on('teamUpdateTime', () =>
    // {
    //   this.sportsNSP.to(socket.id).emit('serverTeamUpdateTime', this.sportRoom.Manager.TeamInfoUpdateTime)
    // })

    socket.on('gameUpdateTime', () =>
    {
      this.sportsNSP.to(socket.id).emit('serverGameUpdateTime', this.sportRoom.Manager.GameInfoUpdateTime)
    })
    //turning this off for now
    // socket.on('allTeamData', () =>
    // {
    //   this.sportsNSP.to(socket.id).emit('serverAllTeamData', this.sportRoom.Manager.TeamInfo)
    // })
    socket.on('allGameData', () =>
    {
      this.sportsNSP.to(socket.id).emit('serverAllGameData', this.sportRoom.Manager.GameInfo)
    })
  }
}

module.exports = SportsLobby
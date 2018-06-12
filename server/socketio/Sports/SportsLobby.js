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

    socket.on('updateTime', () =>
    {
      this.sportsNSP.to(socket.id).emit('serverUpdateTime', this.sportRoom.Manager.TeamInfoUpdateTime)
    })

    socket.on('allTeamData', () =>
    {
      this.sportsNSP.to(socket.id).emit('serverAllTeamData', this.sportRoom.Manager.TeamInfo)
    })
  }
}

module.exports = SportsLobby
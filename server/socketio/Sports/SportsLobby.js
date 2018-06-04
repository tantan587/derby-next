const socketIoHelpers = require('../socketioHelpers')
//const SportsManager = require('./SportsManager')
//const SportsEmitter = require('./SportsEmitter')

class SportsLobby {
  constructor(io)
  {
    this.sportsNSP = io.of('/sports')
    this.sportRoom = {}
  }

  async Create() {

    //this.sportRoom.Emitter = new SportsEmitter(this.sportsNSP)
    //this.sportRoom.Manager = new SportsManager(this.sportRoom.Emitter)
  }

  async Activate() {

    this.sportsNSP.on('connection', socket => 
    { 
      this.SportsListener(socket)
    })
  }

  SportsListener(socket) {

    socket.on('updateTime', () =>
    {
      console.log('i got it')
      this.sportsNSP.to(socket.id).emit('serverDataFull', 'whatsup')
    })
  }
}

module.exports = SportsLobby
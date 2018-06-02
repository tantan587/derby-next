class SocketIoEmitter {

  constructor(draftIo,roomId)
  {
    this.Emitter = draftIo.in(roomId)
  }
}

module.exports = SocketIoEmitter
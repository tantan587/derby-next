const checkPayload = (payload, dataType) => {
  if (typeof dataType === 'object')
  {
    return Object.keys(dataType).map(key =>
    {
      return payload[key] &&  dataType[key] === typeof payload[key]
    }).every(x => x)      
  }
  else if(dataType) {
    {
      return dataType === typeof payload
    }
  }
  return true
}


class Emitter {
  constructor(io, roomId, command, dataType)
  {
    this.io = io
    this.roomId = roomId
    this.command = command
    this.dataType = dataType
  }

  Emit(payload) {
    if(typeof payload === 'undefined')
    {
      this.io.in(this.roomId).emit(this.command)
    }
    else if(checkPayload(payload, this.datatype))
      this.io.in(this.roomId).emit(this.command, payload)
    else
    {
      console.log('emitterType: ', this,
        'payload: ', payload)
      throw('bad format of emitter')
    }
  }  
}

module.exports = Emitter
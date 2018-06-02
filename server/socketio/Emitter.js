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
  constructor(socektIoEmitter, command, dataType)
  {
    this.emitter = socektIoEmitter.Emitter
    this.command = command
    this.dataType = dataType
  }

  Emit(payload) {
    if(typeof payload === 'undefined')
    {
      this.emitter.emit(this.command)
    }
    else if(checkPayload(payload, this.datatype))
      this.emitter.emit(this.command, payload)
    else
    {
      console.log('emitterType: ', this,
        'payload: ', payload)
      throw('bad format of emitter')
    }
  }  
}

module.exports = Emitter
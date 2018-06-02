
const Emitter = require('./Emitter')

const Emitters = (socketIoEmitter) =>  
{
  return {
    DRAFT : {
      JOIN : new Emitter(socketIoEmitter,'people', 
        {state:'string', owners:'object', owner_id:'string'}),
      LEFT : new Emitter(socketIoEmitter,'people', 
        {state:'string', owner_id:'string'}),
      RESET : new Emitter(socketIoEmitter,'reset', 
        {draftStartTime:'string'}),
      START : new Emitter(socketIoEmitter,'start'),
      START_TICK : new Emitter(socketIoEmitter,'startTick'),
      DRAFT_TICK : new Emitter(socketIoEmitter,'draftTick', 'number'),
      WHOS_HERE : new Emitter(socketIoEmitter,'whoshere'),
      MODE_CHANGE : new Emitter(socketIoEmitter,'modechange', 'string'),
      QUEUE_SUCCESS : new Emitter(socketIoEmitter,'queue', 
        {ownerId:'string', queue:'object', success:'boolean'}),
      QUEUE_FAIL : new Emitter(socketIoEmitter,'queue', 
        {ownerId:'string', teamId:'string', success:'boolean'}),
      MESSAGE : new Emitter(socketIoEmitter,'message', 
        {data:'object'}),
      DRAFT_TEAM : new Emitter(socketIoEmitter,'draftTeam', 
        {ownerId:'string', teamId: 'string', queue: 'object', eligibleTeams: 'object'})
    }
  }
}

module.exports = {Emitters}


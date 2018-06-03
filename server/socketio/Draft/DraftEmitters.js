
const Emitter = require('../Emitter')

const Emitters = (io,roomId) =>  
{

  return {
    JOIN : new Emitter(io, roomId,'people', 
      {state:'string', owners:'object', owner_id:'string'}),
    LEFT : new Emitter(io, roomId,'people', 
      {state:'string', owner_id:'string'}),
    RESET : new Emitter(io, roomId,'reset', 
      {draftStartTime:'string'}),
    START : new Emitter(io, roomId,'start'),
    START_TICK : new Emitter(io, roomId,'startTick'),
    DRAFT_TICK : new Emitter(io, roomId,'draftTick', 'number'),
    WHOS_HERE : new Emitter(io, roomId,'whoshere'),
    MODE_CHANGE : new Emitter(io, roomId,'modechange', 'string'),
    QUEUE_SUCCESS : new Emitter(io, roomId,'queueResp', 
      {ownerId:'string', queue:'object', success:'boolean'}),
    QUEUE_FAIL : new Emitter(io, roomId,'queueResp', 
      {ownerId:'string', teamId:'string', success:'boolean'}),
    MESSAGE : new Emitter(io, roomId,'message', 
      {data:'object'}),
    DRAFT_TEAM : new Emitter(io, roomId,'draftTeam', 
      {ownerId:'string', teamId: 'string', queue: 'object', eligibleTeams: 'object'})
  }
}

module.exports = {Emitters}


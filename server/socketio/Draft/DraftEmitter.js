
const SocketIoEmitter = require('../SocketIoEmitter')
const Emitters = require('../Emitters')

class DraftEmitter {

  constructor(draftIo,roomId)
  {
    this.draftEmitters =  Emitters.Emitters(new SocketIoEmitter(draftIo,roomId)).DRAFT
  }

  EmitJoined(owners, ownerId) {

    this.draftEmitters.JOIN.Emit({state:'joined',
      owners:owners,
      owner_id:ownerId}
    )
  }

  EmitLeft(ownerId) {
    this.draftEmitters.LEFT.Emit({state:'left',
      owner_id:ownerId}
    )
  }

  EmitReset(jsonDate) {
    this.draftEmitters.RESET.Emit({draftStartTime: jsonDate})
  }

  EmitDraftLive() {
    this.draftEmitters.START.Emit()
  }

  EmitStartTick() {
    this.draftEmitters.START_TICK.Emit()
  }

  EmitDraftTick(counter) {
    this.draftEmitters.DRAFT_TICK.Emit(counter)
  }

  EmitWhosHere() {
    this.draftEmitters.WHOS_HERE.Emit()
  }

  EmitModeChange(mode){
    this.draftEmitters.MODE_CHANGE.Emit(mode)
  }

  EmitQueueSuccess(ownerId, queue)  {
    this.draftEmitters.QUEUE_SUCCESS.Emit( 
      {
        ownerId:ownerId,
        queue:queue,
        success:true
      })
  }

  EmitQueueFail(ownerId, teamId)  {
    this.draftEmitters.QUEUE_FAIL.Emit( 
      {
        ownerId:ownerId,
        teamId:teamId,
        success:false
      })
  }

  EmitMessage(data) {
    this.draftEmitters.MESSAGE.Emit({data:data})
  }

  EmitDraftTeam(teamId, ownerId, queue, eligibleTeams) {
    this.draftEmitters.DRAFT_TEAM.Emit(
      {
        ownerId:ownerId,
        teamId:teamId,
        queue:queue,
        eligibleTeams:eligibleTeams
      })
  }
}

module.exports = DraftEmitter
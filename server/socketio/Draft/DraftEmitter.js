
const DraftEmitters = require('./DraftEmitters')

class DraftEmitter {

  constructor(draftIo,roomId)
  {
    this.draftEmitters =  DraftEmitters.Emitters(draftIo,roomId)
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

  EmitStartTick(counter) {
    this.draftEmitters.START_TICK.Emit({counter})
  }

  EmitDraftTick(counter, pick) {
    this.draftEmitters.DRAFT_TICK.Emit({counter, pick})
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
    this.draftEmitters.MESSAGE.Emit(
      {clientTs:data.clientTs,
        message:data.message,
        ownerId:data.ownerId})
  }

  EmitDraftTeam(teamId, ownerId, queue, eligibleTeams) {
    this.draftEmitters.DRAFT_TEAM.Emit(
      {
        ownerId,
        teamId,
        queue,
        eligibleTeams,
      })
  }

  EmitRollback(teamId, ownerId, eligibleTeams) {
    this.draftEmitters.ROLLBACK.Emit(
      {
        ownerId,
        teamId,
        eligibleTeams,
      })
  }
}

module.exports = DraftEmitter
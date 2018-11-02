
class Owner {
  constructor(ownerId, leagueId, userId) {
    this.OwnerId = ownerId
    this.LeagueId = leagueId
    this.UserId = userId
    this.Teams = []
  }

  AddTeam(teamId) {
    this.Teams.push(teamId)
  }

}
module.exports = Owner
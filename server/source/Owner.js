const RuleCalculator = require('./Rules/RuleCalculator')


class Owner {
  constructor(ownerId, leagueId, userId, username,  avatar, ownerName) {
    this.OwnerId = ownerId
    this.LeagueId = leagueId
    this.UserId = userId
    this.Username = username
    this.Avatar = avatar
    this.OwnerName = ownerName
    this.Teams = []
    this.TotalPoints = 0
  }

  AddTeam(teamId) {
    this.Teams.push(teamId)
  }

  CalculateTotalPoints(rules) {

    let ruleCalculator = new RuleCalculator()
    this.TotalPoints = this.Teams.reduce((total, team) => {
      return total + ruleCalculator.CalculateTotal(
        rules.GetRule(team.SportId), team.GetRecord())
    },0)
  }

}
module.exports = Owner
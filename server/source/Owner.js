const RuleCalculator = require('./Rules/RuleCalculator')

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

  CalculateTotalPoints(rules) {

    let ruleCalculator = new RuleCalculator()
    return this.Teams.reduce((total, team) => {
      console.log(total)
      return total + ruleCalculator.CalculateTotal(
        rules.GetRule(team.SportId), team.GetRecord())
    },0)
  }

}
module.exports = Owner
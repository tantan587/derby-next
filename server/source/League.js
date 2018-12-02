const OwnerBuilder = require('./OwnerBuilder')
const TeamBuilder = require('./TeamBuilder')
const RuleBuilder = require('./Rules/RulesBuilder')
class League {

  constructor(inpLeagueId) {
    this.leagueId = inpLeagueId
    this.Owners = []
    this.Rules = {}
  }

  async Create() {
    let ownerBuilder = new OwnerBuilder()
    let teamBuilder = new TeamBuilder()
    let ruleBuilder = new RuleBuilder()
    let teams= await teamBuilder.CreateTeamsByLeague(this.leagueId)
    this.Owners = await ownerBuilder.Create(this.leagueId, teams)
    this.Rules = await ruleBuilder.Create(this.leagueId)  

    //console.log(this.Owners)
    this.Owners[0].CalculateTotalPoints(this.Rules)
  }

}
module.exports = League
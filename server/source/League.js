//const OwnerBuilder = require('./OwnerBuilder')
const TeamBuilder = require('./TeamBuilder')
const RuleBuilder = require('./Rules/RulesBuilder')
class League {

  constructor(inpLeagueId) {
    this.leagueId = inpLeagueId
    this.Owners = []
    this.Teams = []
    this.Rules = {}
    //var rules = []
    //var scoring = []
    //var season = []
  }

  async Create() {
    //let ownerBuilder = new OwnerBuilder()
    //this.Owners = await ownerBuilder.CreateOwners(this.leagueId)
    let teamBuilder = new TeamBuilder()
    let ruleBuilder = new RuleBuilder()
    this.Teams = await teamBuilder.CreateTeamsByLeague(this.leagueId)
    this.Rules = await ruleBuilder.Create(this.leagueId)  
    console.log(this.Rules) 
  }

}
module.exports = League
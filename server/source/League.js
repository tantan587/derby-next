//const OwnerBuilder = require('./OwnerBuilder')
const TeamBuilder = require('./TeamBuilder')
class League {

  constructor(inpLeagueId) {
    this.leagueId = inpLeagueId
    this.Owners = []
    this.Teams = []
    //var rules = []
    //var scoring = []
    //var season = []
  }

  async Create() {
    //let ownerBuilder = new OwnerBuilder()
    //this.Owners = await ownerBuilder.CreateOwners(this.leagueId)
    let teamBuilder = new TeamBuilder()
    this.Teams = await teamBuilder.CreateTeamsByLeague(this.leagueId)
    console.log(this.Teams)
  
  }

}
module.exports = League
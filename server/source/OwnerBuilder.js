const knex = require('../db/connection')
const Owner = require('./Owner')

class OwnerBuilder {

  constructor() {
  }

  async CreateTeams(leagueId) {
    let owners = await this.GetOwnersFromDb(leagueId)
    let teams = await this.GetOwnerTeamsFromDb(leagueId)

    let ownerIdToOwner = {}
    owners.forEach(x => {
      ownerIdToOwner[x.owner_id] = new Owner(x.owner_id, leagueId, x.user_id)
    })

    teams.forEach(x => ownerIdToOwner[x.owner_id].AddTeam(x.team_id))

    return Object.values(ownerIdToOwner)
  }

  async GetOwnersFromDb(leagueId) {
    return await knex('fantasy.owners')
      .where('league_id', leagueId)
      .select('*')
  }

  async GetOwnerTeamsFromDb(leagueId) {
    return await knex('fantasy.rosters')
      .where('league_id', leagueId)
      .select('*')
  }

}
module.exports = OwnerBuilder
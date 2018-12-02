
const knex = require('../db/connection')
const Team = require('./Team')
const ScheduleBuilder = require('./ScheduleBuilder')
//const Schedule = require('./Schedule')

class TeamBuilder {

  constructor() {
  }

  async CreateTeamsByLeague(leagueId) {
    let teamsByLeague = await this.GetTeamsByLeagueFromDb(leagueId)
    let teams = await this.GetAllTeams()
    let sportStructureId = (await this.GetSportStructureId(leagueId))[0].sport_structure_id

    let teamInfo = {}
    let scheduleBuilder = new ScheduleBuilder()
    teams.map(x => teamInfo[x.team_id] = x)

    let rtnTeams = []
    let cb = async x => {
      let schedule = await scheduleBuilder.CreateSchedule(x.team_id,sportStructureId)
      rtnTeams.push(new Team(teamInfo[x.team_id].sport_id, x.team_id, teamInfo[x.team_id].city, teamInfo[x.team_id].name, schedule))
    }
    
    for (let index = 0; index < teamsByLeague.length; index++) {
      await cb(teamsByLeague[index])
    }

    //console.log(rtnTeams)
    return rtnTeams
  }

  async GetTeamsByLeagueFromDb(leagueId) {
    return await knex('fantasy.rosters')
      .where('league_id', leagueId)
      .select('*')
  }
  async GetAllTeams() {
    return await knex('sports.team_info')
      .select('*')
  }

  async GetSportStructureId(leagueId) {
    return await knex('fantasy.leagues')
      .where('league_id', leagueId)
      .select('sport_structure_id')
  }

}
module.exports = TeamBuilder


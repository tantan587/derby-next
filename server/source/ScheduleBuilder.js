const knex = require('../db/connection')

class ScheduleBuilder {

  constructor() {
  }

  async CreateSchedule(teamId, sportsStructureId) {
    
    let schedule = await this.GetScheduleFromDb(teamId, sportsStructureId)
    return schedule.rows.map(x => x.global_game_id)
  }

  async GetScheduleFromDb(teamId, sportsStructureId) {

    let str = `select * 
    from sports.schedule where (home_team_id =` +  parseInt(teamId) + `
    or away_team_id = ` +  parseInt(teamId) + `)
    and sport_season_id in (select value::text::int as sport_season_id 
      from fantasy.league_bundle, json_array_elements(current_sport_seasons) where league_bundle_id = ` +  sportsStructureId + `
      )`
    return await knex.raw(str)
  }

}
module.exports = ScheduleBuilder



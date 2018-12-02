const knex = require('../../db/connection')
const Rules = require('./Rules')
const ConferenceRule = require('./ConferenceRule')
const SportRule = require('./SportRule')
const PointRules = require('./PointRules')

class RulesBuilder {

  async Create(leagueId) {

    let rules = new Rules()

    const knexStr1 = `select a.* 
    from fantasy.scoring a, fantasy.sports_structure b, fantasy.leagues c 
    where a.scoring_type_id = b.scoring_type_id 
    and b.sport_structure_id = c.sport_structure_id 
    and c.league_id = '` + leagueId + '\''

    const knexStr2 = `select distinct 
      b.sport_id, a.conference_id, 
      a.number_teams as conf_teams, b.number_teams as sport_teams 
      from fantasy.conferences a, fantasy.sports b 
      where a.league_id = b.league_id 
      and a.sport_id = b.sport_id 
      and a.league_id = '` + leagueId + '\''

    let pointRules = await knex.raw(knexStr1)
      
    let dict = {}
    pointRules.rows.map(points => {
      dict[points.sport_id] = new PointRules(
        points.sport_id, 
        points.regular_season.win,
        points.regular_season.tie,
        points.playoffs.win,
        points.playoffs.bye,
        points.bonus.championship,
        points.bonus.finalist,
        points.bonus.appearance,
        points.playoffs.bowl_win,
        points.regular_season.milestone_points,
        points.regular_season.milestone)
    })

    let ruleData = await knex.raw(knexStr2)
    ruleData.rows.map(rule => 
    {
      if(!rules.SportAlreadyExists(rule.sport_id))
      {
        rules.AddSport(new SportRule(rule.sport_id, 
          parseInt(rule.sport_teams), dict[rule.sport_id]))
      }
      rules.AddConference(rule.sport_id, new ConferenceRule(rule.conference_id,parseInt(rule.conf_teams) ))
    })
    return rules
  }
}

module.exports = RulesBuilder
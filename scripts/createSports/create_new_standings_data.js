const knex = require('../../server/db/connection')

const buildNewStandingsData = async (knex, sport_id, year) => {
    let teams = await knex('sports.team_info').select('team_id')
    let sport_season_ids = 
      await knex('sports.sport_season')
      .where('year', year)
      .andWhere('sport_id', sport_id)
  
    let regular_season_id = sport_season_ids.filter(id => id.season_type === 1).sport_season_id
    let playoff_season_id = sport_season_ids.filter(id => id.season_type === 3).sport_season_id
    let newRegularStandings = []
    let newPlayoffStandings = []
    teams.forEach(x => {
      newRegularStandings.push({
        team_id: x.team_id,
        wins: 0,
        losses: 0, 
        ties: 0,
        sport_season_id: regular_season_id,
        year: year
      })
      newPlayoffStandings.push({
        team_id: x.team_id,
        playoff_wins: 0,
        playoff_losses: 0, 
        bowl_wins: 0,
        byes: 0,
        playoff_status: 1,
        sport_season_id: playoff_season_id,
        year: year
      })
    })

    await knex('sports.standings').insert(newRegularStandings)
    await knex('sports.playoff_standings').insert(newPlayoffStandings)
    console.log('finished')
    process.exit()
  }

  buildNewStandingsData(knex, 102, 2019)
  
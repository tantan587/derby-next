const knex = require('../../server/db/connection')

const t = async () => {

    let playoff_teams = await knex('sports.playoff_standings').where('team_id',"<",103999).andWhere('team_id',">",103000).andWhere('playoff_status',">",2).select('team_id')
    let p = playoff_teams.map(team => team.team_id)
    console.log(p)
}




t()
const findMissingElos = async (knex) => {
    let teams = await knex('sports.team_info')
        .innerJoin('sports.standings', 'sports.standings.team_id', 'sports.team_info.team_id')
        .leftOuterJoin('sports.playoff_standings', function(){
            this.on('sports.playoff_standings.year','=', 'sports.standings.year').andOn('sports.playoff_standings.team_id','=', 'sports.standings.team_id')
        })
        //am going to try subbing in new season elo for all sports since simulating for upcoming year
        //changing this from innerJoin to leftOuterJoin
        .leftOuterJoin('analysis.current_elo', 'analysis.current_elo.team_id', 'sports.team_info.team_id')
        //below should be norm, not above - only temporary
        //.innerJoin('analysis.current_elo','analysis.current_elo.team_id', 'sports.team_info.team_id')
        .select('analysis.current_elo.*', 'sports.team_info.team_id', 'sports.standings.year')
    
    let elosForInsert = []
    teams.forEach(team => {
        if(team.elo == null){
            elosForInsert.push({'elo': 1300, 'team_id': team.team_id, 'year': team.year})
        }
    })

    await knex('analysis.current_elo').insert(elosForInsert)

    console.log('Missing Elos:', elosForInsert.length)

}

module.exports = findMissingElos
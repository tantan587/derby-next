const knex = require('../../server/db/connection')
const asyncForEach = require('../asyncForEach')

const NFL_playoff_info = 
    [{
        team_id: '102101',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Arizona' },
     {
        team_id: '102103',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Baltimore' },
     {
        team_id: '102106',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Chicago' },
     {
        team_id: '102107',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Cincinnati' },
     {
        team_id: '102108',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Cleveland' },
     {
        team_id: '102109',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Dallas' },
     {
        team_id: '102110',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Denver' },
     {
        team_id: '102111',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Detroit' },
     {
        team_id: '102112',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Green Bay' },
     {
        team_id: '102113',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Houston' },
     {
        team_id: '102114',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Indianapolis' },
     {
        team_id: '102117',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Los Angeles' },
     {
        team_id: '102119',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Miami' },
     {
        team_id: '102123',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'New York' },
     {
        team_id: '102124',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'New York' },
     {
        team_id: '102125',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Oakland' },
     {
        team_id: '102129',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Seattle' },
     {
        team_id: '102128',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'San Francisco' },
     {
        team_id: '102130',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Tampa Bay' },
     {
        team_id: '102132',
        playoff_wins: 0,
        playoff_losses: 0,
        byes: 0,
        playoff_status: 2,
        sport_season_id: 6,
        city: 'Washington' },
     {
        team_id: '102118',
        playoff_wins: 0,
        playoff_losses: 1,
        byes: 0,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'Los Angeles' },
     {
        team_id: '102115',
        playoff_wins: 2,
        playoff_losses: 1,
        byes: 0,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'Jacksonville' },
     {
        team_id: '102120',
        playoff_wins: 1,
        playoff_losses: 1,
        byes: 1,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'Minnesota' },
     {
        team_id: '102105',
        playoff_wins: 0,
        playoff_losses: 1,
        byes: 0,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'Carolina' },
     {
        team_id: '102126',
        playoff_wins: 3,
        playoff_losses: 0,
        byes: 1,
        playoff_status: 6,
        sport_season_id: 6,
        city: 'Philadelphia' },
     {
        team_id: '102127',
        playoff_wins: 0,
        playoff_losses: 1,
        byes: 1,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'Pittsburgh' },
     {
        team_id: '102131',
        playoff_wins: 1,
        playoff_losses: 1,
        byes: 0,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'Tennessee' },
     {
        team_id: '102121',
        playoff_wins: 2,
        playoff_losses: 1,
        byes: 1,
        playoff_status: 5,
        sport_season_id: 6,
        city: 'New England' },
     {
        team_id: '102122',
        playoff_wins: 1,
        playoff_losses: 1,
        byes: 0,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'New Orleans' },
     {
        team_id: '102116',
        playoff_wins: 0,
        playoff_losses: 1,
        byes: 0,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'Kansas City' },
     {
        team_id: '102102',
        playoff_wins: 1,
        playoff_losses: 1,
        byes: 0,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'Atlanta' },
     {
        team_id: '102104',
        playoff_wins: 0,
        playoff_losses: 1,
        byes: 0,
        playoff_status: 4,
        sport_season_id: 6,
        city: 'Buffalo' } ]

const updateNFL = async () =>{
    await asyncForEach(NFL_playoff_info, async (team)=> {
        await knex('sports.playoff_standings')
            .where('team_id', team.team_id)
            .where('sport_season_id', 6)
            .update({playoff_status: team.playoff_status, byes: team.byes})
    })
}

module.exports = updateNFL
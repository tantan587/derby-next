//this is currently deprecated and not used - in case we decide to change way we update day of schedule, here it is started. 
//unneeded with fantasy data change

const db_helpers = require('./helpers').data
const fantasyHelpers = require('../server/routes/helpers/fantasyHelpers')
const knex = require('../server/db/connection')
const myNull = '---'
const getDayCount = require('./Analysis/dayCount.js')

const updateBoxScore = async () => {
    let now = new Date()
    let n = getDayCount(now)
    let today_games = 
    await knex('sports.schedule')
    .where('day_count',"<",n+1)
    .whereNotIn('status',['Final', 'Postponed', 'Canceled', 'F/OT', 'F/SO'])

    let games_by_sport = {}
    today_games.forEach(game => {
        if(!(game.sport_id in games_by_sport)){
            games_by_sport[game.sport_id] = {}
        }
        let date = game.date_time.split('T')[0]
        if(!(games_by_sport[game.sport_id][date])){
            games_by_sport[game.sport_id][date] = []
        }
        games_by_sport[game.sport_id][date].push(game.global_game_id)
    })
 
    let clean_games = []
    let sport_ids = Object.keys(games_by_sport)
    await Promise.all(sport_ids.map(async sport_id => {
        await Promise.all(Object.keys(games_by_sport[sport_id]).map(async date =>{
            let game = await db_helpers.getFdata(knex, sport_name_sport_id[sport_id][0], sport_name_sport_id[sport_id][1], sport_name_sport_id[sport_id][2], date)
            let clean = JSON.parse(game)
            console.log(clean)
        })
    )
    })
)
    process.exit()

    // let date = 0
    // db_helpers.getFdata(knex, 'NBA', 'NBAv3StatsClient', 'getBoxScoresByDate', date)
}

const sport_name_sport_id = {
    101: ['NBA', 'NBAv3StatsClient', 'getBoxScoresByDatePromise'],
    102: ['NFL', 'NFLv3StatsClient', 'getBoxScoresByDatePromise'],
    103: ['MLB', 'MLBv3StatsClient', 'getBoxScoresByDatePromise'],
    104: ['NHL', 'NHLv3StatsClient', 'getBoxScoresByDatePromise'],
    105: ['CFB', 'CFBv3StatsClient', 'getBoxScoresByDatePromise'],
    106: ['CBB', 'CBBv3StatsClient', 'getBoxScoresByDatePromise'],
    107: ['EPL', 'Soccerv3StatsClient', 'getBoxScoresByDatePromise']
}

const NBA_schedule_data = (games) => {
    return games.map(game =>{
        return {
        home_team_score: game.HomeTeamScore,
        away_team_score: game.AwayTeamScore,
        status: game.Status,
        winner: game.Status[0] === 'F' ? game.HomeTeamScore > game.AwayTeamScore ? 'H' : 'A' : myNull,
        period: game.Quarter === null || status[0] === 'F' ? myNull : game.Quarter,
        updated_time: game.Updated ? game.Updated : myNull,
        game_extra: {
            home_quarter_1: game.Quarters[0].HomeScore === null ? myNull : game.Quarters[0].HomeScore, 
            home_quarter_2: game.Quarters[1].HomeScore === null ? myNull : game.Quarters[1].HomeScore,
            home_quarter_3: game.Quarters[2].HomeScore === null ? myNull : game.Quarters[2].HomeScore,  
            home_quarter_4: game.Quarters[3].HomeScore === null ? myNull : game.Quarters[3].HomeScore, 
            home_overtime_1: game.Quarters[4].HomeScore === null ? myNull : game.Quarters[4].HomeScore,

        }

        }
    })
}

updateBoxScore()
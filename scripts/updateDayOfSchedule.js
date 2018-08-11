//this is currently deprecated and not used - in case we decide to change way we update day of schedule, here it is started. 
//unneeded with fantasy data change

const db_helpers = require('./helpers').data
const knex = require('../server/db/connection')
const myNull = '---'
const getDayCount = require('./Analysis/dayCount.js')
const asyncForEach = require('./asyncForEach')
const sport_json = require('./scheduleJsons')

//in the below function: use pull todays games to just update games from today, across all sports
//use games by sport to update ALL games that occured before today, by sport
//this takes a while, because it needs to pull every date individually. So for baseball: it is over 120+ games
//it cannot be done pulling all of it
const updateBoxScoreJSON = async () => {
    // let today_games = await pullTodaysGamesFromKnex()
    // let games_by_sport = arrangeGamesBySport(today_games)
    
    let sport_games = await previousGamesFromKnexBySport(106)
    let games_by_sport = arrangeGamesBySport(sport_games)

    let cleanGames = await pullGamesFromFantasyData(games_by_sport)

    let schedInfo = createScheduleForInsert(cleanGames)
    db_helpers.updateScheduleFromBoxScore(knex, schedInfo)
    .then(result => {
        console.log('Number of Schedules Updated: ', result)
        process.exit()
    })

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


const createScheduleForInsert = (cleanGames) => {
    return cleanGames.map(game => {
        return {
            global_game_id: fantasy_2_global[game.sport_id] + Number(game.Game.GameID),
            game_extra: JSON.stringify(sport_json[game.sport_id].box_score(game))
        }
    })
}


const fantasy_2_global = {
    '101': 20000000,
    '102': 0,
    '103': 10000000,
    '104': 30000000,
    '105': 50000000,
    '106': 60000000,
    '107': 90000000
  }

const pullTodaysGamesFromKnex = async () => {
    let now = new Date()
    let dayCount = getDayCount(now)
    let today_games = await knex('sports.schedule')
        .where('day_count', "<", dayCount + 1)
        .whereNotIn('status', ['Final', 'Postponed', 'Canceled', 'F/OT', 'F/SO'])
        .whereIn('sport_id', [101,103,104,105,106])
    return today_games
}

const previousGamesFromKnexBySport = async (sport_id) => {
    let now = new Date()
    let dayCount = getDayCount(now)
    let today_games = await knex('sports.schedule')
        .where('day_count', "<", 1539)
        .where('day_count', "<", dayCount)
        .andWhere('sport_id', sport_id)
        .whereNotIn('status', ['Postponed', 'Canceled'])
    return today_games
}

const pullGamesFromFantasyData = async (games_by_sport) => {
    let cleanGames = []
    let sport_ids = Object.keys(games_by_sport)
    await asyncForEach(sport_ids, async (sport_id) => {
        await asyncForEach(Object.keys(games_by_sport[sport_id]), async (date) => {
            console.log(date)
            let games_by_date = await db_helpers.getFdata(knex, sport_name_sport_id[sport_id][0], sport_name_sport_id[sport_id][1], sport_name_sport_id[sport_id][2], date)
            let clean = JSON.parse(games_by_date)
            clean.forEach(game => {
                game.sport_id = sport_id
                game.global_game_id = fantasy_2_global[sport_id] + Number(game.Game.GameID)
            })
            let games_for_update = clean.filter(game => games_by_sport[sport_id][date].includes(game.global_game_id))
            cleanGames.push(...games_for_update)
        })
    })
    return cleanGames
}

const arrangeGamesBySport = (today_games) => {
    let games_by_sport = {}
    today_games.forEach(game => {
        if (!(game.sport_id in games_by_sport)) {
            games_by_sport[game.sport_id] = {}
        }
        let date = game.date_time.split('T')[0]
        if (!(games_by_sport[game.sport_id][date])) {
            games_by_sport[game.sport_id][date] = []
        }
        games_by_sport[game.sport_id][date].push(game.global_game_id)

    })
    return games_by_sport
}





updateBoxScoreJSON()

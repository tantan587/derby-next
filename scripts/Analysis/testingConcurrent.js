// var cq = require('concurrent-queue')
 
// var queue = cq().limit({ concurrency: 2 }).process(function (task, cb) {
//     console.log(task + ' started')
//     setTimeout(function () {
//         cb(null, task)
//     }, 1000)
// })
 
// for (var i = 1; i <= 10; i++) queue('task '+i, function (err, task) {
//     console.log(task + ' done')
// })
const knex = require('../../server/db/connection')
var cq = require('concurrent-queue')
const getDayCount = require('./dayCount.js')
const db_helpers = require('../helpers').data



const m = ()=>{
var queue = cq().limit({ concurrency: 2 }).process()

 
for (var i = 1; i <= 10; i++) queue('task '+i).then() 
}


const previousGamesFromKnexBySport = async (sport_id) => {
    let now = new Date()
    let dayCount = getDayCount(now)
    let today_games = await knex('sports.schedule')
      .where('day_count', '<', 1539)
      .where('day_count', '<', dayCount)
      .andWhere('sport_id', sport_id)
      .whereNotIn('status', ['Postponed', 'Canceled'])
    return today_games
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

let t = async () => {
    let f = await previousGamesFromKnexBySport(101)
    let bySport = arrangeGamesBySport(f)
    var queue = cq().limit({ concurrency: 2 })
    let cleanGames =[]
    console.log(queue.processing)
    // Object.keys(bySport[101]).forEach(date => {
    //     queue.process(getFantasyData(date, 101, cleanGames, bySport))
    // })

    // console.log(cleanGames)
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

const fantasy_2_global = {
    '101': 20000000,
    '102': 0,
    '103': 10000000,
    '104': 30000000,
    '105': 50000000,
    '106': 60000000,
    '107': 90000000
  }

const getFantasyData = async (date, sport_id, cleanGames, games_by_sport) => {
    let games_by_date = await db_helpers.getFdata(knex, sport_name_sport_id[sport_id][0], sport_name_sport_id[sport_id][1], sport_name_sport_id[sport_id][2], date)
    let clean = JSON.parse(games_by_date)
    clean.forEach(game => {
      game.sport_id = sport_id
      game.global_game_id = fantasy_2_global[sport_id] + Number(game.Game.GameID)
    })
    let games_for_update = clean.filter(game => games_by_sport[sport_id][date].includes(game.global_game_id))
    cleanGames.push(...games_for_update)
}


t()
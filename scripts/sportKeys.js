//maybe this shouldn't be hard coded, but instead pull from database
const sport_keys = {
  101: {sport_name: 'NBA', api: 'NBAv3StatsClient', standingsPromiseToGet: 'getStandingsPromise', schedulePromiseToGet: 'getSchedulesPromise'},
  102: {sport_name: 'NFL', api: 'NFLv3StatsClient', standingsPromiseToGet: 'getStandingsPromise', schedulePromiseToGet: 'getScoresBySeasonPromise'},
  103: {sport_name: 'MLB', api: 'MLBv3StatsClient', standingsPromiseToGet: 'getStandingsPromise', schedulePromiseToGet: 'getSchedulesPromise'},
  104: {sport_name: 'NHL', api: 'NHLv3StatsClient', standingsPromiseToGet: 'getStandingsPromise', schedulePromiseToGet: 'getSchedulesPromise'},
  105: {sport_name: 'CFB', api: 'CFBv3StatsClient', standingsPromiseToGet: 'getTeamSeasonStatsStandingsPromise', schedulePromiseToGet: 'getSchedulesPromise'},
  106: {sport_name: 'CBB', api: 'CBBv3StatsClient', standingsPromiseToGet: 'getTeamSeasonStatsPromise', schedulePromiseToGet: 'getSchedulesPromise'},
  107: {sport_name: 'EPL', api: 'Soccerv3StatsClient', standingsPromiseToGet: 'getStandingsPromise', schedulePromiseToGet: 'getSchedulePromise'}

}

module.exports = sport_keys
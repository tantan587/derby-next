const NBA_json_box_score = (game) => {

  let quarters_played = game.Quarters.length
  return {
    last_play: game.Game.LastPlay,
    home_quarter_1: quarters_played>0 ? game.Quarters[0].HomeScore : -1,
    home_quarter_2: quarters_played>1 ? game.Quarters[1].HomeScore : -1,
    home_quarter_3: quarters_played>2 ? game.Quarters[2].HomeScore : -1,
    home_quarter_4: quarters_played>3 ? game.Quarters[3].HomeScore : -1,
    home_quarter_ot_1: quarters_played>4 ? game.Quarters[4].HomeScore : -1,
    home_quarter_ot_2: quarters_played>5 ? game.Quarters[5].HomeScore : -1,
    home_quarter_ot_3: quarters_played>6 ? game.Quarters[6].HomeScore : -1,
    away_quarter_1: quarters_played>0 ? game.Quarters[0].AwayScore : -1,
    away_quarter_2: quarters_played>1 ? game.Quarters[1].AwayScore : -1,
    away_quarter_3: quarters_played>2 ? game.Quarters[2].AwayScore : -1,
    away_quarter_4: quarters_played>3 ? game.Quarters[3].AwayScore : -1,
    away_quarter_ot_1: quarters_played>4 ? game.Quarters[4].AwayScore : -1,
    away_quarter_ot_2: quarters_played>5 ? game.Quarters[5].AwayScore : -1,
    away_quarter_ot_3: quarters_played>6 ? game.Quarters[6].AwayScore : -1,
    channel: game.Game.Channel,
    spread: game.Game.PointSpread,
    over_under: game.Game.OverUnder,
    periods_played: quarters_played
  }
}

const NBA_json = game => {
  return {}
}

const NFL_json = (game) => {
  return {
    home_quarter_1: game.HomeScoreQuarter1,
    home_quarter_2: game.HomeScoreQuarter2,
    home_quarter_3: game.HomeScoreQuarter3,
    home_quarter_4: game.HomeScoreQuarter4,
    home_overtime_1: game.HomeScoreOvertime,
    away_quarter_1: game.AwayScoreQuarter1,
    away_quarter_2: game.AwayScoreQuarter2,
    away_quarter_3: game.AwayScoreQuarter3,
    away_quarter_4: game.AwayScoreQuarter4,
    away_overtime_1: game.AwayScoreOvertime,
    down: game.Down,
    distance: game.Distance,
    possession: game.Possession, 
    yard_line: game.YardLine,
    yard_line_territory: game.YardLineTerritory,
    down_and_distance: game.DownAndDistance,
    red_zone: game.RedZone,
    last_play: game.LastPlay
  }
}

const MLB_json = (game) => {
  return {}
}

const MLB_json_box_score = (raw_game) => {
  let game = raw_game.Game
  let innings_played = raw_game.Innings.length
  let innings = raw_game.Innings
  let current_inning = game.Inning+game.InningHalf
  return {
    outs: game.Outs,
    balls: game.Balls,
    strikes: game.Strikes,
    away_starter: game.AwayTeamStartingPitcher,
    home_starter: game.HomeTeamStartingPitcher,
    current_pitcher: game.CurrentPitcher,
    current_hitter: game.CurrentHitter,
    winning_pitcher: game.WinningPitcher,
    losing_pitcher: game.LosingPitcher,
    away_errors: game.AwayTeamErrors,
    away_hits: game.AwayTeamHits,
    home_hits: game.HomeTeamHits,
    home_errors: game.HomeTeamErrors,
    half_inning: game.InningHalf,
    last_play: game.LastPlay, 
    home_inning_1: innings_played>0 && current_inning !== "1T" ? innings[0].HomeTeamRuns : - 1,
    home_inning_2: innings_played>1 && current_inning !== "2T" ? innings[1].HomeTeamRuns : - 1,
    home_inning_3: innings_played>2 && current_inning !== "3T" ? innings[2].HomeTeamRuns : - 1,
    home_inning_4: innings_played>3 && current_inning !== "4T" ? innings[3].HomeTeamRuns : - 1,
    home_inning_5: innings_played>4 && current_inning !== "5T" ? innings[4].HomeTeamRuns : - 1,
    home_inning_6: innings_played>5 && current_inning !== "6T" ? innings[5].HomeTeamRuns : - 1,
    home_inning_7: innings_played>6 && current_inning !== "7T" ? innings[6].HomeTeamRuns : - 1,
    home_inning_8: innings_played>7 && current_inning !== "8T" ? innings[7].HomeTeamRuns : - 1,
    home_inning_9: innings_played>8 && current_inning !== "9T" ? innings[8].HomeTeamRuns : - 1,
    home_inning_10: innings_played>9 && current_inning !== "10T" ? innings[9].HomeTeamRuns : - 1,
    home_inning_11: innings_played>10 && current_inning !== "11T" ? innings[10].HomeTeamRuns : - 1,
    home_inning_12: innings_played>11 && current_inning !== "12T" ? innings[11].HomeTeamRuns : - 1,
    home_inning_13: innings_played>12 && current_inning !== "13T" ? innings[12].HomeTeamRuns : - 1,
    home_inning_14: innings_played>13 && current_inning !== "14T" ? innings[13].HomeTeamRuns : - 1,
    home_inning_15: innings_played>14 && current_inning !== "15T" ? innings[14].HomeTeamRuns : - 1,
    home_inning_16: innings_played>15 && current_inning !== "16T" ? innings[15].HomeTeamRuns : - 1,
    home_inning_17: innings_played>16 && current_inning !== "17T" ? innings[16].HomeTeamRuns : - 1,
    home_inning_18: innings_played>17 && current_inning !== "18T" ? innings[17].HomeTeamRuns : - 1,
    home_inning_19: innings_played>18 && current_inning !== "19T" ? innings[18].HomeTeamRuns : - 1,
    home_inning_20: innings_played>19 && current_inning !== "20T" ? innings[19].HomeTeamRuns : - 1,
    away_inning_1: innings_played>0 ? innings[0].AwayTeamRuns : - 1,
    away_inning_2: innings_played>1 ? innings[1].AwayTeamRuns : - 1,
    away_inning_3: innings_played>2 ? innings[2].AwayTeamRuns : - 1,
    away_inning_4: innings_played>3 ? innings[3].AwayTeamRuns : - 1,
    away_inning_5: innings_played>4 ? innings[4].AwayTeamRuns : - 1,
    away_inning_6: innings_played>5 ? innings[5].AwayTeamRuns : - 1,
    away_inning_7: innings_played>6 ? innings[6].AwayTeamRuns : - 1,
    away_inning_8: innings_played>7 ? innings[7].AwayTeamRuns : - 1,
    away_inning_9: innings_played>8 ? innings[8].AwayTeamRuns : - 1,
    away_inning_10: innings_played>9 ? innings[9].AwayTeamRuns : - 1,
    away_inning_11: innings_played>10 ? innings[10].AwayTeamRuns : - 1,
    away_inning_12: innings_played>11 ? innings[11].AwayTeamRuns : - 1,
    away_inning_13: innings_played>12 ? innings[12].AwayTeamRuns : - 1,
    away_inning_14: innings_played>13 ? innings[13].AwayTeamRuns : - 1,
    away_inning_15: innings_played>14 ? innings[14].AwayTeamRuns : - 1,
    away_inning_16: innings_played>15 ? innings[15].AwayTeamRuns : - 1,
    away_inning_17: innings_played>16 ? innings[16].AwayTeamRuns : - 1,
    away_inning_18: innings_played>17 ? innings[17].AwayTeamRuns : - 1,
    away_inning_19: innings_played>18 ? innings[18].AwayTeamRuns : - 1,
    away_inning_20: innings_played>19 ? innings[19].AwayTeamRuns : - 1,




  }
}

const NHL_json = (game) => {
  return {
    last_play: game.LastPlay
  }
}

const NHL_json_box_score = (raw_game) => {
  let game = raw_game.Game
  let periods_played = game.Periods.length
  return {
    last_play: game.LastPlay,
    home_period_1: periods_played>0 ? game.Periods[0].HomeScore : -1,
    home_period_2: periods_played>1 ? game.Periods[1].HomeScore : -1,
    home_period_3: periods_played>2  ? game.Periods[2].HomeScore : -1,
    home_period_ot_1: periods_played>3 ? game.Periods[3].HomeScore : -1,
    home_period_ot_2: periods_played>4 ? game.Periods[4].HomeScore : -1,
    home_period_ot_3: periods_played>5 ? game.Periods[5].HomeScore : -1,
    home_period_ot_4: periods_played>6 ? game.Periods[6].HomeScore : -1,
    away_period_1: periods_played>0 ? game.Periods[0].AwayScore : -1,
    away_period_2: periods_played>1 ? game.Periods[1].AwayScore : -1,
    away_period_3: periods_played>2 ? game.Periods[2].AwayScore : -1,
    away_period_ot_1: periods_played>3 ? game.Periods[3].AwayScore : -1,
    away_period_ot_2: periods_played>4 ? game.Periods[4].AwayScore : -1,
    away_period_ot_3: periods_played>5 ? game.Periods[5].AwayScore : -1,
    away_period_ot_4: periods_played>6 ? game.Periods[6].AwayScore : -1,
    periods_played: periods_played,
    channel: game.Channel,
    spread: game.PointSpread,
    over_under: game.OverUnder
    
  }
}

const CBB_json = game => {
  return {}
}

const CBB_json_box_score = (raw_game) => {
  let game = raw_game.Game
  let periods_played = game.Periods.length
  return {
    home_half_1: periods_played>0 ? game.Periods[0].HomeScore : -1,
    home_half_2: periods_played>1 ? game.Periods[1].HomeScore : -1,
    home_period_ot_1: periods_played>3 ? game.Periods[2].HomeScore : -1,
    home_period_ot_2: periods_played>4 ? game.Periods[3].HomeScore : -1,
    home_period_ot_3: periods_played>5 ? game.Periods[4].HomeScore : -1,
    home_period_ot_4: periods_played>6 ? game.Periods[5].HomeScore : -1,
    away_half_1: periods_played>0 ? game.Periods[0].AwayScore : -1,
    away_half_2: periods_played>1 ? game.Periods[1].AwayScore : -1,
    away_period_ot_1: periods_played>3 ? game.Periods[2].AwayScore : -1,
    away_period_ot_2: periods_played>4 ? game.Periods[3].AwayScore : -1,
    away_period_ot_3: periods_played>5 ? game.Periods[4].AwayScore : -1,
    away_period_ot_4: periods_played>6 ? game.Periods[5].AwayScore : -1,
    periods_played: periods_played
  }
}

const CFB_json = game => {
  return {}
}

const CFB_json_box_score = (game) => {
  let periods_played = game.Periods.length
  return {
    home_period_1: periods_played>0 ? game.Periods[0].HomeScore : -1,
    home_period_2: periods_played>1 ? game.Periods[1].HomeScore : -1,
    home_period_3: periods_played>2  ? game.Periods[2].HomeScore : -1,
    home_period_4: periods_played>3  ? game.Periods[3].HomeScore : -1,
    home_period_ot_1: periods_played>4 ? game.Periods[4].HomeScore : -1,
    home_period_ot_2: periods_played>5 ? game.Periods[5].HomeScore : -1,
    home_period_ot_3: periods_played>6 ? game.Periods[6].HomeScore : -1,
    home_period_ot_4: periods_played>7 ? game.Periods[7].HomeScore : -1,
    away_period_1: periods_played>0 ? game.Periods[0].AwayScore : -1,
    away_period_2: periods_played>1 ? game.Periods[1].AwayScore : -1,
    away_period_3: periods_played>2 ? game.Periods[2].AwayScore : -1,
    away_period_4: periods_played>3 ? game.Periods[3].AwayScore : -1,
    away_period_ot_1: periods_played>4 ? game.Periods[4].AwayScore : -1,
    away_period_ot_2: periods_played>5 ? game.Periods[5].AwayScore : -1,
    away_period_ot_3: periods_played>6 ? game.Periods[6].AwayScore : -1,
    away_period_ot_4: periods_played>7 ? game.Periods[7].AwayScore : -1,
    periods_played: periods_played,
    spread: game.Game.PointSpread,
    over_under: game.Game.OverUnder  }
}

const EPL_json = (game) => {
  return {
    last_play: game.LastPlay,
    home_half_1: game.HomeTeamScorePeriod1,
    home_half_2: game.HomeTeamScorePeriod2,
    home_period_ot_1: game.HomeTeamScoreExtraTime,
    away_half_1: game.AwayTeamScorePeriod1,
    away_half_2: game.AwayTeamScorePeriod2,
    away_period_ot_1: game.AwayTeamScoreExtraTime
  }
}


const sport_JSON_functions = {
  101: {schedule: NBA_json, box_score: NBA_json_box_score},
  102: {schedule: NFL_json},
  103: {schedule: MLB_json, box_score: MLB_json_box_score},
  104: {schedule: NHL_json, box_score: NHL_json_box_score},
  105: {schedule: CFB_json, box_score: CFB_json_box_score},
  106: {schedule: CBB_json, box_score: CBB_json_box_score},
  107: {schedule: EPL_json}
}

module.exports = sport_JSON_functions
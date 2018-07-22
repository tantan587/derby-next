const NBA_json = (game) => {
    return {
      //quarter data in stats/box scores
      last_play: game.LastPlay
      //below needs to be added back when they update
      // home_quarter_1: game.HomeScoreQuarter1,
      // home_quarter_2: game.HomeScoreQuarter2,
      // home_quarter_3: game.HomeScoreQuarter3,
      // home_quarter_4: game.HomeScoreQuarter4,
      // home_overtime: game.HomeScoreOvertime,
      // away_quarter_1: game.AwayScoreQuarter1,
      // away_quarter_2: game.AwayScoreQuarter2,
      // away_quarter_3: game.AwayScoreQuarter3,
      // away_quarter_4: game.AwayScoreQuarter4,
      // away_overtime: game.AwayScoreOvertime,
    }
  }
  
  const NFL_json = (game) => {
    return {
      home_quarter_1: game.HomeScoreQuarter1,
      home_quarter_2: game.HomeScoreQuarter2,
      home_quarter_3: game.HomeScoreQuarter3,
      home_quarter_4: game.HomeScoreQuarter4,
      home_overtime: game.HomeScoreOvertime,
      away_quarter_1: game.AwayScoreQuarter1,
      away_quarter_2: game.AwayScoreQuarter2,
      away_quarter_3: game.AwayScoreQuarter3,
      away_quarter_4: game.AwayScoreQuarter4,
      away_overtime: game.AwayScoreOvertime,
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
      last_play: game.LastPlay
    }
  }
  
  const NHL_json = (game) => {
    return {
      last_play: game.LastPlay
    }
  }
  
  const CBB_json = (game) => {
    return {
      last_play: game.LastPlay
    }
  }
  
  const CFB_json = (game) => {
    return {
      //there is no last play: last_play: game.LastPlay
    }
  }
  
  const EPL_json = (game) => {
    return {
      last_play: game.LastPlay
    }
  }
  
  const sport_JSON_functions = {
    101: NBA_json,
    102: NFL_json,
    103: MLB_json,
    104: NHL_json,
    105: CFB_json,
    106: CBB_json,
    107: CBB_json
  }

  module.exports = sport_JSON_functions
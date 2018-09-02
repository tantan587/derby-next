export const organizeData = (data) => {
  const { oneTeam, game, teams } = data

  const areWeHome = teams[game.home_team_id] ? teams[game.home_team_id].team_name === oneTeam.team_name 
    : teams[game.away_team_id].team_name !== oneTeam.team_name

  const awayTeamName = teams[game.away_team_id] ? teams[game.away_team_id].team_name : 'UNKNOWN'
  const awayTeamScore = game.away_team_score

  const homeTeamName = teams[game.home_team_id] ? teams[game.home_team_id].team_name : 'UNKNOWN'
  const homeTeamScore = game.home_team_score

  const derbyPointsObject = oneTeam.scoring[oneTeam.scoring_type_id]

  const result = homeTeamScore > awayTeamScore ? ['W', 'L'] : awayTeamScore > homeTeamScore ? ['L', 'W'] : ['D', 'D']

  if(game.sport_id == '104' && game.status[1] === '/'){
    if(result[0]==='L'){
      result[0] = 'OTL'
    } else{
      result[1] = 'OTL'}
  }


  if (areWeHome) {

    let tableData = {
      opponent: `vs. ${awayTeamName}`,
      result: result[0], //homeTeamScore > awayTeamScore ? 'W' : 'L',
      score: `${Math.max(homeTeamScore, awayTeamScore)}-${Math.min(homeTeamScore, awayTeamScore)}`,
      location: 'Home',
      derby_points: derbyPointsObject.regular_season.win

    }
    return tableData
  } else {
    // console.log(`we are against ${homeTeamName}`)
    // console.log(`they scored ${homeTeamScore} and we scored ${awayTeamScore}`)
    // console.log(`it is ${homeTeamScore > homeTeamScore} that we won`)
    // console.log(`the formatted score looks like ${Math.max(awayTeamScore, homeTeamScore)}-${Math.min(awayTeamScore, homeTeamScore)}`)
    let tableData = {
      opponent: `@ ${homeTeamName}`,
      result: result[1], //awayTeamScore > homeTeamScore ? 'W' : awayTeamScore < homeTeamScore ? 'L': 'D',
      score: `${Math.max(awayTeamScore, homeTeamScore)}-${Math.min(awayTeamScore, homeTeamScore)}`,
      location: 'Away',
      derby_points: derbyPointsObject.regular_season.win
    }
    return tableData
  }
}

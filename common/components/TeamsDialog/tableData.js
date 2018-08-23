export const organizeData = (data) => {
  const { oneTeam, game, teams } = data

  const areWeHome = teams[game.home_team_id] ? teams[game.home_team_id].team_name === oneTeam.team_name 
    : teams[game.away_team_id].team_name !== oneTeam.team_name

  const awayTeamName = teams[game.away_team_id] ? teams[game.away_team_id].team_name : 'UNKNOWN'
  const awayTeamScore = game.away_team_score

  const homeTeamName = teams[game.home_team_id] ? teams[game.home_team_id].team_name : 'UNKNOWN'
  const homeTeamScore = game.home_team_score

  const derbyPointsObject = oneTeam.scoring[oneTeam.scoring_type_id]

  console.log('points:', derbyPointsObject.regular_season.win)

  // console.log('away is', teams[game.away_team_id].team_name)
  // console.log('home is', teams[game.home_team_id].team_name)
  // console.log('our team is', oneTeam.team_name)
  // console.log('is away our team?', teams[game.away_team_id].team_name === oneTeam.team_name)
  // console.log('is home our team?', teams[game.home_team_id].team_name === oneTeam.team_name)

  if (areWeHome) {
    // console.log('if home is our team')
    // console.log(`we are against ${awayTeamName}`)
    // console.log(`they scored ${awayTeamScore} and we scored ${homeTeamScore}`)
    // console.log(`it is ${homeTeamScore > awayTeamScore} that we won`)
    // console.log(`the formatted score looks like ${Math.max(homeTeamScore, awayTeamScore)}-${Math.min(homeTeamScore, awayTeamScore)}`)
    let tableData = {
      opponent: `vs. ${awayTeamName}`,
      result: homeTeamScore > awayTeamScore ? 'W' : 'L',
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
      result: awayTeamScore > homeTeamScore ? 'W' : 'L',
      score: `${Math.max(awayTeamScore, homeTeamScore)}-${Math.min(awayTeamScore, homeTeamScore)}`,
      location: 'Away',
      derby_points: derbyPointsObject.regular_season.win
    }
    return tableData
  }
}

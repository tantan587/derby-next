const sportsHelpers = require('../../routes/helpers/sportsHelpers')
const fantasyHelpers = require('../../routes/helpers/fantasyHelpers')
const hash = require('object-hash')

function SportsManager(io) {
  var teamInfoHashBySportSeason = {}
  var gameInfoHash = {}
  let teamInfoBySportSeason = {}
   
  this.Create = async () =>
  {
    teamInfoBySportSeason = await getSports()
    this.GameInfo = {}
    const gameInfoResults = await getNearGames()
    
    Object.keys(teamInfoBySportSeason).forEach((sportSeasonId) => {
      Object.keys(teamInfoBySportSeason[sportSeasonId]).forEach(teamId => {
        if(!teamInfoHashBySportSeason[sportSeasonId])
        {
          teamInfoHashBySportSeason[sportSeasonId] = {}
        }
        teamInfoHashBySportSeason[sportSeasonId][teamId] = hash(teamInfoBySportSeason[sportSeasonId][teamId])
      })
    })

    gameInfoResults.forEach(game =>{
      if(!gameInfoHash[game.dayCount])
      {
        gameInfoHash[game.dayCount] = {}
        this.GameInfo[game.dayCount] = {}
      }
      gameInfoHash[game.dayCount][game.global_game_id] = hash(game) 
      this.GameInfo[game.dayCount][game.global_game_id] = game
    }) 

    setTeamUpdateTime()
    setGameUpdateTime()
    waitToGetNewData()
  }

  this.TeamInfoBySportsSeason = async (sportSeasons) => {
    //need to be able to rectify playoffs here as well
    if (!sportSeasons)
    {
      sportSeasons = await fantasyHelpers.GetSportSeasonsByLeague()
    }
    let rtnObj = {}

    sportSeasons.forEach(x => {

      if(teamInfoBySportSeason[x])
        Object.assign(rtnObj, teamInfoBySportSeason[x])
    })
    return rtnObj
  }

  const waitToGetNewData = async () => {
    setInterval(async () => {
      let teamInfoDiff =  await calculateDiffForTeam()
      if(Object.keys(teamInfoDiff).length > 0)
      {
        setTeamUpdateTime()

        io.emit('serverDiffTeamData', 
          {diff:teamInfoDiff, 
            updateTime:this.TeamInfoUpdateTime})
      }
      let gameInfoDiff = await calculateDiffForGames()
      if(Object.keys(gameInfoDiff).length > 0)
      {
        setGameUpdateTime()
        io.emit('serverDiffGameData', 
          {diff:gameInfoDiff, 
            updateTime:this.GameInfoUpdateTime})
      }
      
    }, 5000)
  }

  const calculateDiffForTeam = async () => {

    const teamInfoTemp = await getSports()
    let teamInfoDiff = {}
    Object.keys(teamInfoTemp).forEach((sportSeasonId) => {
      Object.keys(teamInfoTemp[sportSeasonId]).forEach(teamId => {
        const teamHash = hash(teamInfoTemp[sportSeasonId][teamId])
        if(teamHash !== teamInfoHashBySportSeason[sportSeasonId][teamId])
        {
          teamInfoHashBySportSeason[sportSeasonId][teamId] = teamHash
          if(!teamInfoDiff[sportSeasonId])
            teamInfoDiff[sportSeasonId] = {}
          teamInfoDiff[sportSeasonId][teamId] = teamInfoTemp[sportSeasonId][teamId]
          teamInfoBySportSeason[sportSeasonId][teamId] = teamInfoTemp[sportSeasonId][teamId]

        }
      })
    })
    return teamInfoDiff
  }

  const calculateDiffForGames = async () => {

    const gameInfo = await getNearGames()
    let gameInfoDiff = {}
    gameInfo.forEach((game) => {
      const gameHash = hash(game)
      const dayCount  = game.dayCount
      const globalGameId = game.global_game_id
      //first time pulling in a new day
      if (!gameInfoHash[dayCount])
      {
        //delete 3 days before because this data is old 
        
        delete this.GameInfo[dayCount-3]
        this.GameInfo[dayCount] = {}

        delete gameInfoHash[dayCount-3]
        gameInfoHash[dayCount] = {}
      }
      if(gameHash !== gameInfoHash[dayCount][globalGameId])
      {
        if (!gameInfoDiff[dayCount])
        {
          gameInfoDiff[dayCount] = {}
        }
        gameInfoHash[dayCount][globalGameId] = gameHash
        gameInfoDiff[dayCount][globalGameId] = game
        this.GameInfo[dayCount][globalGameId] = game
      }
    })
    return gameInfoDiff
  }

  //need to also get playoffs here as well
  const getSports = async () => {
    return await sportsHelpers.GetRegularSeasonTeamInfo()
  }

  const getNearGames = async () => {
    return await sportsHelpers.getNearSchedule()
  }

  const setTeamUpdateTime = () =>{
    this.TeamInfoUpdateTime = new Date()
  }

  const setGameUpdateTime = () =>{
    this.GameInfoUpdateTime = new Date()
  }

}

module.exports = SportsManager
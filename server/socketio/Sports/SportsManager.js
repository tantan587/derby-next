const sportsHelpers = require('../../routes/helpers/sportsHelpers')
const hash = require('object-hash')

function SportsManager(io) {
  var teamInfoHash = {}
  var gameInfoHash = {}
   
  this.Create = async () =>
  {
    var a = new Date()
    console.log('the time time and offset is',a, -a.getTimezoneOffset()/60)
    this.TeamInfo = await getSports()
    this.GameInfo = {}
    const gameInfoResults = await getNearGames()
    
    Object.keys(this.TeamInfo).map((teamId) => {
      teamInfoHash[teamId] = hash(this.TeamInfo[teamId])
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

    const teamInfo = await getSports()
    let teamInfoDiff = {}
    Object.keys(teamInfo).map((teamId) => {
      const teamHash = hash(teamInfo[teamId])
      if(teamHash !== teamInfoHash[teamId])
      {
        teamInfoHash[teamId] = teamHash
        teamInfoDiff[teamId] = teamInfo[teamId]
        this.TeamInfo[teamId] = teamInfo[teamId]

      }
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

  const getSports = async () => {
    return await sportsHelpers.getTeamInfo()
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
const sportsHelpers = require('../../routes/helpers/sportshelpers')
const hash = require('object-hash')

function SportsManager(io) {
  var teamInfoDiff = {}
  var teamInfoHash = {}
   
  this.Create = async () =>
  {
    this.TeamInfo = await getSports()
    
    teamInfoHash = {}
    Object.keys(this.TeamInfo).map((teamId) => {
      teamInfoHash[teamId] = hash(this.TeamInfo[teamId])
    })
    setUpdateTime()
    waitToGetNewData()
  }

  const waitToGetNewData = async () => {
    setInterval(async () => {
      teamInfoDiff = {}
      await calculateDiffForTeam()
      if(Object.keys(teamInfoDiff).length > 0)
      {
        setUpdateTime()
        io.emit('serverDiffTeamData', 
          {diff:teamInfoDiff, 
            updateTime:this.TeamInfoUpdateTime})
      }
      
    }, 5000)
  }

  const calculateDiffForTeam = async () => {

    const teamInfo = await getSports()

    Object.keys(teamInfo).map((teamId) => {
      const teamHash = hash(teamInfo[teamId])
      if(teamHash !== teamInfoHash[teamId])
      {
        teamInfoHash[teamId] = teamHash
        teamInfoDiff[teamId] = teamInfo[teamId]
        this.TeamInfo[teamId] = teamInfo[teamId]

      }
    })
  }

  const getSports = async () => {
    return await sportsHelpers.getTeamInfo()
  }

  const setUpdateTime = () =>{
    this.TeamInfoUpdateTime = new Date()
  }

}

module.exports = SportsManager
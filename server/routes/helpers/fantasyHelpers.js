const knex = require('../../db/connection')
const C = require('../../../common/constants')

function handleReduxResponse(res, code, action){
  res.status(code).json(action)
}

const getLeague = (league_id, res, type) =>{


  var str = `select a.*, b.username, c.league_name, c.max_owners, c.league_id, d.total_points, d.rank, e.room_id, e.start_time, f.total_teams from
  fantasy.owners a, users.users b, fantasy.leagues c, fantasy.points d, draft.settings e,
   (select league_id, sum(number_teams) as total_teams from fantasy.sports where league_id = '` + league_id + '\' group by league_id) f' +
  ' where a.league_id = e.league_id and a.league_id = f.league_id and a.user_id = b.user_id and a.league_id = c.league_id and a.owner_id = d.owner_id'
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0) 
      {
        var league_name = result.rows[0].league_name
        var max_owners = result.rows[0].max_owners
        var league_id = result.rows[0].league_id
        var total_teams = result.rows[0].total_teams
        var room_id = result.rows[0].room_id
        var start_time = result.rows[0].start_time
        var owners = []
        result.rows.map((owner,i) => owners.push(
          {
            owner_name:owner.owner_name,
            owner_id:owner.owner_id, 
            total_points:owner.total_points,
            rank:owner.rank,
            username:owner.username,
            user_id: owner.user_id,
            draft_position: i
          }))
        return handleReduxResponse(res,200, {
          type: type,
          league_name : league_name,
          max_owners : max_owners,
          total_teams:total_teams,
          league_id : league_id,
          owners : owners,
          room_id: room_id,
          draft_start_time:start_time
        })
      }
      else
      {
        return handleReduxResponse(res,400, {})
      }
    })


}

const updateTeamPointsTable = (newTeamPoints) =>
{
  return knex
    .withSchema('fantasy')
    .table('team_points')
    .then(results => {
      let oldTeamPoints = {}
      var updateList =[]
      results.map(result => {
        if (!oldTeamPoints[result.league_id]){
          oldTeamPoints[result.league_id] = {}
        }
        oldTeamPoints[result.league_id][result.team_id] =result})
      newTeamPoints.map(teamPoints =>
      {
        //needs to be != because of 100.00 vs 100
        if(oldTeamPoints[teamPoints.league_id][teamPoints.team_id].reg_points != teamPoints.reg_points)
        {
          updateList.push(Promise.resolve(updateOneRowTeamPoints(teamPoints.league_id,teamPoints.team_id,'reg_points',teamPoints.reg_points )))
        }  
         
        if(oldTeamPoints[teamPoints.league_id][teamPoints.team_id].bonus_points != teamPoints.bonus_points)  
          updateList.push(Promise.resolve(updateOneRowTeamPoints(teamPoints.owner_id,teamPoints.team_id,'bonus_points',teamPoints.bonus_points )))
      })
      if (updateList.length > 0)
      {
        return Promise.all(updateList)
          .then(() => { 
            console.log("im done updating!")
            return updateList.length
          })
      }
      else
        return 0
    })
}

const updatePointsTable = (newPoints) =>
{
  return knex
    .withSchema('fantasy')
    .table('points')
    .then(results => {
      let oldPoints = {}
      var updateList =[]
      results.map(result => oldPoints[result.owner_id] =result)

      newPoints.map(owner =>
      {
        if(oldPoints[owner.owner_id].total_points !== owner.total_points)  
          updateList.push(Promise.resolve(updateOneRow('fantasy','points','owner_id',owner.owner_id,'total_points',owner.total_points )))
        if(oldPoints[owner.owner_id].rank !== owner.rank)  
          updateList.push(Promise.resolve(updateOneRow('fantasy','points','owner_id',owner.owner_id,'rank',owner.rank )))
      })
      if (updateList.length > 0)
      {
        return Promise.all(updateList)
          .then(() => { 
            console.log("im done updating!")
            return updateList.length
          })
      }
      else
        return 0
    })
}

const updateOneRow = (schema, table, column_link, column_link_val, column, value) =>
{
  return knex
    .withSchema(schema)
    .table(table)
    .where(column_link,column_link_val)
    .update(column, value)
    .then(() =>
    {
      //console.log(column_link_val + " updated!")
    })
}

const updateOneRowTeamPoints = (league_id,team_id, column, value ) =>
{
  return knex
    .withSchema('fantasy')
    .table('team_points')
    .where('league_id',league_id)
    .andWhere('team_id',team_id)
    .update(column, value)
    .then(() =>
    {
      //console.log(column_link_val + " updated!")
    })
}

const updateTeamPoints = (league_id) =>
{
  return getStandingData()
    .then((data) =>
    {
      let points = [
        {sport_id: 101, win:3, tie:0},
        {sport_id: 102, win:15, tie:0},
        {sport_id: 103, win:2, tie:0},
        {sport_id: 104, win:3.5, tie:1.75},
        {sport_id: 105, win:16.75, tie:0},
        {sport_id: 106, win:7, tie:0},
        {sport_id: 107, win:6.75, tie:2.25}]
    
      
      let str = league_id 
        ? 'select a.*, b.sport_id from fantasy.team_points a, sports.team_info b where a.team_id = b.team_id and a.league_id = \'' + league_id + '\''
        : 'select a.*, b.sport_id from fantasy.team_points a, sports.team_info b where a.team_id = b.team_id'
      
      return knex.raw(str)
        .then(result =>
        {
          if (result.rows.length > 0) 
          {
            const teamPoints = result.rows.map(fteam => {
              const team = data[fteam.team_id]
              const league = points.filter(league => league.sport_id == fteam.sport_id)[0]
              fteam.reg_points = league.win * team.wins + league.tie * team.ties
              fteam.bonus_points = 0
              return fteam}) 
            updateTeamPointsTable(teamPoints)
              .then((result) =>
              {
                console.log('Number of Teams Updated: ' + result)
                return 0
              })
             

          }

        })
    })
}

const updateLeaguePoints = (league_id) =>
{
  let str = league_id 
    ? 'select a.reg_points, a.bonus_points, b.owner_id, b.league_id from fantasy.team_points a, fantasy.rosters b where a.team_id = b.team_id and a.league_id = b.league_id and a.league_id = \'' + league_id + '\''
    : 'select a.reg_points, a.bonus_points, b.owner_id, b.league_id from fantasy.team_points a, fantasy.rosters b where a.team_id = b.team_id and a.league_id = b.league_id'
  
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0) 
      {
        let byOwner = {}
        result.rows.map(roster => {
          if (!(roster.owner_id in byOwner))
          {
            byOwner[roster.owner_id] = {total_points:0, league_id:roster.league_id, owner_id:roster.owner_id}
          }
          byOwner[roster.owner_id].total_points += Number.parseFloat(roster.reg_points) + Number.parseFloat(roster.bonus_points)
        })
        let byLeague = {}
        Object.values(byOwner).map(owner => {
          if (!(owner.league_id in byLeague))
          {
            byLeague[owner.league_id] = []
          }
          byLeague[owner.league_id].push(owner)
        })
        let addingRank = Object.values(byLeague).map(league => {
          league.sort(function(a,b) {return b.total_points - a.total_points})
          return league.map( (owner, i) => {owner.rank = i+1; return owner})
        })
        let fantasyPoints = [].concat.apply([], addingRank)
        return updatePointsTable(fantasyPoints)
          .then(result => {
            console.log('Number of Fantasy Points Updated: ' + result)
            return 0
          })
      }
    })

}

const getStandingData = () =>
{
  return new Promise((resolve) => {
    return knex.withSchema('sports').table('standings').select('*')
      .then(result => {
        let teamMap = {}
        result.map(team => {teamMap[team.team_id] = {...team}})
        resolve(teamMap)
      })
  })
}

const updateFantasy = (league_id, res) =>
{
  updateLeaguePoints(league_id)
    .then(() => handleReduxResponse(res, 200, {type: C.SAVED_DRAFT}))
}

const updatePoints = () =>
{
  return updateTeamPoints()
    .then(() => {
      return updateLeaguePoints()
    })
}

const getDayCount = (year, month, day) => {

  const date = new Date(year + ' ' + month + ' ' + day + ' ' + '00:00:00 GMT-04:00')
  // The number of milliseconds in one day
  var ONE_DAY = 1000 * 60 * 60 * 24

  //my starting point 08/25/2013 12AM EST
  var startingDate = 1377403200000
  var date_ms = date.getTime()

  // Convert back to days and return
  return Math.floor((date_ms - startingDate)/ONE_DAY)
}

const getDayCountStr = (date) => {
  var split = date.split('T')[0].split('-')
  return getDayCount(split[0],split[1],split[2])
}

const formatAMPM = (date) => {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  minutes = minutes < 10 ? '0'+ minutes : minutes
  var strTime = hours + ':' + minutes +  ampm + ' EST'
  return strTime
}

//const getSports

module.exports = {
  getLeague,
  updateTeamPoints,
  updateLeaguePoints,
  updateFantasy,
  updatePoints,
  getDayCountStr,
  formatAMPM
}
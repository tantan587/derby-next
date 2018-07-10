const knex = require('../../db/connection')
const C = require('../../../common/constants')


function handleReduxResponse(res, code, action){
  res.status(code).json(action)
}

const getLeague = async (league_id, user_id, res, type) =>{

  var leagueInfoStr = `select a.league_name, a.max_owners, a.league_id, b.room_id, b.start_time, b.draft_position, c.total_teams 
  from fantasy.leagues a, draft.settings b, (
    select league_id, sum(number_teams) as total_teams from fantasy.sports where league_id = '` + league_id + `' group by league_id) c
  where a.league_id = b.league_id and a.league_id = c.league_id`

  var ownerInfoStr = `select a.*, b.username, c.total_points, c.rank from
  fantasy.owners a, users.users b, fantasy.points c
  where a.user_id = b.user_id and a.owner_id = c.owner_id and a.league_id = '` + league_id + '\''

  var teamInfoStr = `select b.owner_id, a.team_id, a.reg_points as points
   from fantasy.team_points a 
   left outer join fantasy.rosters b on a.team_id = b.team_id 
   where a.league_id = '` + league_id + '\''

  const leagueInfo = await knex.raw(leagueInfoStr)
  const ownerInfo = await knex.raw(ownerInfoStr)
  const teamInfo = await knex.raw(teamInfoStr)

  if (leagueInfo.rows.length === 1)
  {

    var league_name = leagueInfo.rows[0].league_name
    var max_owners = leagueInfo.rows[0].max_owners
    var total_teams = leagueInfo.rows[0].total_teams
    var room_id = leagueInfo.rows[0].room_id
    var start_time = leagueInfo.rows[0].start_time
    var draft_position = leagueInfo.rows[0].draft_position
    var my_owner_id = ''
    var owners = []
    var teams = {}

    ownerInfo.rows.forEach((owner) => {
      if(owner.user_id === user_id)
      {
        my_owner_id = owner.owner_id
      }
      owners.push(
        {
          owner_name:owner.owner_name,
          owner_id:owner.owner_id,
          total_points:parseFloat(owner.total_points),
          rank:owner.rank,
          username:owner.username,
          user_id: owner.user_id,
          draft_position: draft_position.indexOf(owner.owner_id),
          avatar:owner.avatar
        })
    })

    teamInfo.rows.forEach(teamRow => {
      teams[teamRow.team_id] = {owner_id:teamRow.owner_id, points:parseFloat(teamRow.points)}
    })

    const draftOrder = GetDraftOrder(total_teams,owners.length)
    return handleReduxResponse(res,200, {
      type: type,
      league_name : league_name,
      max_owners : max_owners,
      total_teams:total_teams,
      league_id : league_id,
      owners : owners,
      room_id: room_id,
      draft_start_time:start_time,
      my_owner_id:my_owner_id,
      draftOrder:draftOrder,
      teams:teams
    })
  }
  else
  {
    return handleReduxResponse(res,400, {})
  }
}

const GetDraftOrder = (totalTeams, totalOwners) =>
{
  let draftOrder = []
  for(let round = 0; round < totalTeams; round++)
  {
    let ownerIndex = round % 2 === 0 
      ? Array.apply(null, {length: totalOwners}).map(Number.call, Number)
      : Array.apply(null, {length: totalOwners}).map(Number.call, Number).reverse()

    ownerIndex.map((ownerIndex,pick) => draftOrder.push({pick:pick + round*totalOwners, ownerIndex:ownerIndex}))

  }
  return draftOrder
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
        if (!oldTeamPoints[result.scoring_type_id]){
          oldTeamPoints[result.scoring_type_id] = {}
        }
        oldTeamPoints[result.scoring_type_id][result.team_id] = result})
      newTeamPoints.map(teamPoints =>
      {
        //needs to be != because of 100.00 vs 100
        if(oldTeamPoints[teamPoints.scoring_type_id][teamPoints.team_id].reg_points != teamPoints.reg_points)
        {
          updateList.push(Promise.resolve(updateOneRowTeamPoints(teamPoints.scoring_type_id,teamPoints.team_id,'reg_points',teamPoints.reg_points )))
        }

        if(oldTeamPoints[teamPoints.scoring_type_id][teamPoints.team_id].bonus_points != teamPoints.bonus_points){
          updateList.push(Promise.resolve(updateOneRowTeamPoints(teamPoints.scoring_type_id,teamPoints.team_id,'bonus_points',teamPoints.bonus_points )))}
        
        if(oldTeamPoints[teamPoints.scoring_type_id][teamPoints.team_id].playoff_points != teamPoints.playoff_points){
          updateList.push(Promise.resolve(updateOneRowTeamPoints(teamPoints.scoring_type_id,teamPoints.team_id,'playoff_points',teamPoints.playoff_points )))}
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

//total points for each owner in the league - be sure its correctly called
const updatePointsTable = (newPoints, projected=false) =>
{
  return knex
    .withSchema('fantasy')
    .table('points')
    .then(results => {
      let oldPoints = {}
      var updateList =[]
      results.map(result => oldPoints[result.owner_id] =result)
      let points = projected ? 'total_projected_points' : 'total_points'
      let rank = projected ? 'projected_rank': 'rank'
      newPoints.forEach(owner =>
      {
        if(oldPoints[owner.owner_id][points] !== owner[points])
          updateList.push(Promise.resolve(updateOneRow('fantasy','points','owner_id',owner.owner_id,points,owner[points] )))
        if(oldPoints[owner.owner_id][rank] !== owner[rank])
          updateList.push(Promise.resolve(updateOneRow('fantasy','points','owner_id',owner.owner_id, rank ,owner[rank] )))
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

const updateOneRowTeamPoints = (scoring_type_id,team_id, column, value ) =>
{
  return knex
    .withSchema('fantasy')
    .table('team_points')
    .where('scoring_type_id',scoring_type_id)
    .andWhere('team_id',team_id)
    .update(column, value)
    .then(() =>
    {
      //console.log(column_link_val + " updated!")
    })
}

//maybe this should be modified to grab all the different scoring structures
const getPoints = async (knex, scoring_type = 1) => {
  return knex
    .withSchema('fantasy')
    .table('scoring')
    .where('scoring_type_id', scoring_type)
    .then((points)=>{
      let point_map = {}
      points.forEach(structure => {
        points_map[structure.sport_id] = {...structure}
      })
      return point_map
    })
  }

const getPointsStructure = async (knex) => {
  return knex
    .withSchema('fantasy')
    .table('scoring')
    .then((points)=>{
      let point_map = {}
      points.forEach(structure => {
        if(!point_map[structure.scoring_type_id]){
          point_map[structure.scoring_type_id] = {}
        }
        point_map[structure.scoring_type_id][structure.sport_id] = {...structure}
      })
      return point_map
    })
  }
  
//this should be updated to do all the different team points structures
//similar to the way i did that before with the update fantasy projected points
//need to set up this table somewhere...
const updateTeamPoints = async () =>
{
  let points = await getPointsStructure(knex)
  return getStandingDataPlayoffAndRegular()
    .then((data) =>
    {
      //somewhere, this needs to check to be sure the league scoring type is 1 and input it here
      //let points = await getPoints(knex, scoring_type_id)


      //this should maybe be taken out, unless it would be by scoring type instead
      let str = 'select a.*, b.sport_id from fantasy.team_points a, sports.team_info b where a.team_id = b.team_id'

      return knex.raw(str)
        .then(result =>
        {
          if (result.rows.length > 0)
          {
            const teamPoints = result.rows.map(fteam => {
              const team = data[fteam.team_id]
              //const league = points.filter(league => league.sport_id == fteam.sport_id)[0]
              let sport_id = fteam.sport_id
              if(sport_id === ('103'||'104')){
                let milestone_parameter = sport_id === '103' ? team.wins : team.wins+team.ties/2
                let milestone_points = points[fteam.scoring_type_id][sport_id].regular_season.milestone_points
                let bonus_win = milestone_parameter < points[fteam.scoring_type_id][sport_id].regular_season.milestone_1 ? 0 :
                milestone_parameter < points[fteam.scoring_type_id][sport_id].regular_season.milestone_2 ? milestone_points :
                milestone_parameter < points[fteam.scoring_type_id][sport_id].regular_season.milestone_3 ? milestone_points*2 : milestone_points*3
              }else{
                let bonus_win = 0
              }
              let bonus_points = team.playoff.result === 'appearance' ? points[fteam.scoring_type_id][sport_id].bonus.appearance : 
                                  team.playoff.result === 'finalist' ? points[fteam.scoring_type_id][sport_id].bonus.finalist + points[fteam.scoring_type_id][sport_id].bonus.appearance :
                                  team.playoff.result === 'championship' ? points[fteam.scoring_type_id][sport_id].bonus.championship + points[fteam.scoring_type_id][sport_id].bonus.finalist + points[fteam.scoring_type_id][sport_id].bonus.appearance : 0
              fteam.reg_points = points[f_team.scoring_type_id][sport_id].regular_season.wins * team.wins + points[fteam.scoring_type_id][sport_id].regular_season.tie * team.ties
              fteam.playoff_points = points[fteam.scoring_type_id][sport_id].playoffs.wins * team.playoff_wins
              //below depends on how we format bowl wins
              sport_id === '105' ? fteam.playoff_points += (points[fteam.scoring_type_id][sport_id].playoffs.bowl_win * team.playoff.bowl_win) : 0
              fteam.bonus_points = bonus_win + bonus_points
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

const updateLeagueProjectedPoints = async (league_id) => {
  // let fantasy_leagues = await knex.withSchema('fantasy').table('leagues').select('league_id', 'scoring_type_id')
  // let fantasy_rosters = await knex.withSchema('fantasy').table('rosters').select('*')
  // let fantasy_projections = await knex.withSchema('fantasy').table('projections').select('*')
  // let fantasy_owners = await knex.withSchema('fantasy').table('owners').select('*')
  // console.log(leagues)
  // let league_scoring_type = {}
  // leagues.forEach(league => league_scoring_type[league.league_id]=league.scoring_type_id)
  const math = require('mathjs')

  let rosters = await knex('fantasy.rosters')
    .leftJoin('fantasy.leagues', 'fantasy.rosters.league_id', 'fantasy.leagues.league_id')
    .leftJoin('fantasy.projections', function(){
      this.on('fantasy.projections.team_id','=','fantasy.rosters.team_id').andOn('fantasy.leagues.scoring_type_id', '=', 'fantasy.projections.scoring_type_id')
    })
    .select('*')
  
  let m = math.max(rosters.map(team=>team.day_count))

  let new_rosters = league_id ? 
    rosters.filter(team => {return (team.day_count === m && team.league_id === league_id)}) :
    rosters.filter(team => team.day_count === m) 

  let byOwner = {}
  new_rosters.forEach(roster => {
    if(!(roster.owner_id in byOwner)){
      byOwner[roster.owner_id] = {projected_points:0, league_id:roster.league_id, owner_id:roster.owner_id}
    }
    byOwner[roster.owner_id].projected_points += Number.parseFloat(roster.points)
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
    league.sort(function(a,b) {return b.projected_points - a.projected_points})
    return league.map( (owner, i) => {owner.rank = i+1; return owner})
    
  let fantasyPoints = [].concat.apply([], addingRank)

  return updatePointsTable(fantasyPoints, true)
          .then(result => {
            console.log('Number of Fantasy Points Updated: ' + result)
            return 0
          })
  })

  
}

//runs for each league to run points
//not sure if this is set up to run for each and every league - this hsould match up leagues with scoring type
const updateLeaguePoints = (league_id) =>
{
  //check the and part of this raw statement to be sure it works
  let str = league_id
    ? 'select a.reg_points, a.bonus_points, a.playoff_points, b.league_id from fantasy.team_points a, fantasy.rosters b, fantasy.leagues c where a.team_id = b.team_id and c.league_id = b.league_id and c.scoring_type_id = a.scoring_type_id and a.league_id = \'' + league_id + '\''
    : 'select a.reg_points, a.bonus_points, a.playoff_points, b.league_id from fantasy.team_points a, fantasy.rosters b, fantasy.leagues c where a.team_id = b.team_id and c.league_id = b.league_id andWhere c.scoring_type_id = a.scoring_type_id'

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
          byOwner[roster.owner_id].total_points += Number.parseFloat(roster.reg_points) + Number.parseFloat(roster.bonus_points) + Number.parseFloat(roster.playoff_points)
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

const getStandingDataPlayoffAndRegular = () =>
{
  return new Promise((resolve) => {
    return knex
      .withSchema('sports')
      .talbe('standings')
      .leftOuterJoin('sports.playoff_standings', 'sports.standings.team_id', 'sports.playoff_standings.team_id')
      .select('*')
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

const formatGameDate = (date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()

  return `${month}/${day}/${year}`
}

module.exports = {
  getLeague,
  getDayCount,
  updateTeamPoints,
  updateLeaguePoints,
  updateLeagueProjectedPoints,
  updateFantasy,
  updatePoints,
  getDayCountStr,
  formatAMPM,
  formatGameDate,
  GetDraftOrder,
  updateLeagueProjectedPoints
}

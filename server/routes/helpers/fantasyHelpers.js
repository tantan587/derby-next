const knex = require('../../db/connection')
const C = require('../../../common/constants')


function handleReduxResponse(res, code, action){
  res.status(code).json(action)
}

const getLeague = async (league_id, user_id, res, type) => {
  var leagueInfoStr = `select a.league_name, a.max_owners, a.league_id, b.room_id, b.start_time, b.draft_position, b.seconds_pick, b.state, c.total_teams 
  from fantasy.leagues a, draft.settings b, (
    select league_id, sum(number_teams) as total_teams from fantasy.sports where league_id = '` + league_id + `' group by league_id) c
  where a.league_id = b.league_id and a.league_id = c.league_id`

  var ownerInfoStr = `select a.*, b.username, c.total_points, c.rank from
  fantasy.owners a, users.users b, fantasy.points c
  where a.user_id = b.user_id and a.owner_id = c.owner_id and a.league_id = '` + league_id + '\''

  var seasonsStr = `select b.* from (select value::text::int as sport_season_id, league_bundle_id from fantasy.league_bundle, json_array_elements(current_sport_seasons)) a, 
  sports.sport_season b, fantasy.leagues c, fantasy.sports_structure d, fantasy.sports e
  where a.sport_season_id = b.sport_season_id
  and c.sport_structure_id = d.sport_structure_id
  and d.league_bundle_id = a.league_bundle_id
  and c.league_id = e.league_id 
  and b.sport_id = e.sport_id
  and c.league_id = '` + league_id + '\''

  var lastYearPointsStr = `select d.team_id, d.reg_points, d.bonus_points, d.playoff_points from fantasy.leagues b,
  fantasy.sports_structure c, fantasy.team_points d 
  where b.sport_structure_id = c.sport_structure_id
  and c.previous_sport_structure_id = d.sport_structure_id 
  and b.league_id = '` +  league_id + '\''
  
  var teamInfoStr = `
  SELECT aaa.*, bbb.owner_id, bbb.overall_pick 
  FROM (
    SELECT aa.reg_points, aa.bonus_points, aa.playoff_points, bb.* 
    FROM (
      SELECT c.points as proj_points, c.ranking, c.team_id, b.sport_structure_id
      FROM fantasy.leagues b, fantasy.projections c
      WHERE b.league_id = '` + league_id + `'
      AND b.sport_structure_id = c.sport_structure_id
      AND c.day_count = (
        SELECT max(day_count) 
        FROM fantasy.projections
      )
    ) bb
    LEFT OUTER JOIN fantasy.team_points aa
    ON aa.team_id = bb.team_id
    AND aa.sport_structure_id = bb.sport_structure_id
  ) aaa
  LEFT OUTER JOIN (
    SELECT d.*
    FROM fantasy.rosters d, fantasy.owners e 
    WHERE d.owner_id = e.owner_id 
   AND e.league_id = '` + league_id + `'
  ) bbb
  ON aaa.team_id = bbb.team_id`

  const leagueInfo = await knex.raw(leagueInfoStr)
  const ownerInfo = await knex.raw(ownerInfoStr)
  const teamInfo = await knex.raw(teamInfoStr)
  const seasonsInfo = await knex.raw(seasonsStr)
  const lastYearPoints = await knex.raw(lastYearPointsStr)
  const seasonIds = await GetSportSeasonsByLeague(league_id)
  const rules = await getSportLeagues(league_id)

  if (leagueInfo.rows.length === 1)
  {
    var league_name = leagueInfo.rows[0].league_name
    var max_owners = leagueInfo.rows[0].max_owners
    var total_teams = leagueInfo.rows[0].total_teams
    var room_id = leagueInfo.rows[0].room_id
    var start_time = leagueInfo.rows[0].start_time
    let seconds_pick = leagueInfo.rows[0].seconds_pick
    let mode = leagueInfo.rows[0].state
    var draft_position = leagueInfo.rows[0].draft_position
    var my_owner_id = ''
    var imTheCommish = false
    var owners = []
    var teams = {}

    ownerInfo.rows.forEach((owner) => {
      if(owner.user_id === user_id)
      {
        my_owner_id = owner.owner_id
        imTheCommish = owner.commissioner
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
          avatar:owner.avatar,
          commissioner:owner.commissioner
        })
    })

    const seasons = {}
    seasonsInfo.rows.forEach(x => {
      if(!seasons[x.sport_id])
      {
        seasons[x.sport_id] = {}
      }
      if(x.season_type ===1)
      {
        seasons[x.sport_id].start = x.start_season_date
      }
      else(x.season_type ===3)
      {
        seasons[x.sport_id].playoffs = x.start_season_date
        seasons[x.sport_id].end = x.end_season_date
      }
    })

    const ownerGames = await getOwnersUpcomingGames(my_owner_id)
    teamInfo.rows.forEach(teamRow => {
      let reg_points = parseFloat(teamRow.reg_points) || 0
      let bonus_points = parseFloat(teamRow.bonus_points) || 0
      let playoff_points = parseFloat(teamRow.playoff_points) || 0
      teams[teamRow.team_id] = {
        owner_id:teamRow.owner_id,
        overall_pick:teamRow.overall_pick,
        reg_points,
        bonus_points,
        playoff_points,
        proj_points:parseFloat(teamRow.proj_points),
        ranking:parseInt(teamRow.ranking),
        points:reg_points+bonus_points+playoff_points}
    })

    lastYearPoints.rows.forEach(x => {
      if(teams[x.team_id])
        teams[x.team_id].lastYearPoints = parseFloat(x.reg_points) + parseFloat(x.bonus_points) + parseFloat(x.playoff_points)
    })

    const draftOrder = GetDraftOrder(total_teams,owners.length)

    return handleReduxResponse(res,200, {
      type,
      seasons,
      league_name,
      max_owners,
      total_teams,
      league_id,
      owners,
      room_id,
      draftInfo: {
        start_time,
        seconds_pick,
        mode
      },
      my_owner_id,
      imTheCommish,
      draftOrder,
      teams,
      ownerGames,
      rules,
      seasonIds,
    })
  }
  else
  {
    return handleReduxResponse(res,400, {})
  }
}

const getSportLeagues = (league_id) =>{

  var str = `select a.sport_id, a.conference_id, a.number_teams as num_in_conf, b.number_teams as num_of_conf,
   b.conf_strict, c.sport_name, d.display_name from fantasy.conferences a, fantasy.sports b,
    sports.leagues c, sports.conferences d where a.league_id = '` + league_id +
    '\' and a.league_id = b.league_id and a.sport_id = b.sport_id and a.sport_id = c.sport_id and a.conference_id = d.conference_id'
  return knex.raw(str)
    .then(result =>
    {
      const leaguesToConferenceMap = {}
      result.rows.map(row =>
      {
        if(!leaguesToConferenceMap[row.sport_id])
        {
          leaguesToConferenceMap[row.sport_id] =
          {sport_id:row.sport_id, sport:row.sport_name, conf_strict:row.conf_strict, num:row.num_of_conf, conferences:[]}
        }
        leaguesToConferenceMap[row.sport_id].conferences.push({conference_id:row.conference_id, conference:row.display_name, num:row.num_in_conf})

      })
      return Object.values(leaguesToConferenceMap)
    })
}

const GetSportSeasonsByLeague = async (league_id) => {

  let knexStr
  if (league_id)
    knexStr  =  `select current_sport_seasons from fantasy.sports_structure a, 
      fantasy.league_bundle b, fantasy.leagues c
      where c.league_id = '` + league_id + `' 
      and a.sport_structure_id = c.sport_structure_id
      and a.league_bundle_id = b.league_bundle_id`

  else
    knexStr  =  `select current_sport_seasons from fantasy.sports_structure a, 
  fantasy.league_bundle b where sport_structure_id = 0 and a.league_bundle_id = b.league_bundle_id`

  let sport_seasons = await knex.raw(knexStr)

  //return JSON.stringify(sport_seasons.rows[0].current_sport_seasons).replace('[', '(').replace(']', ')')
  return sport_seasons.rows[0].current_sport_seasons
}

const getOwnersUpcomingGames = async (ownerId) =>
{
  var d = new Date()
  //-60 for eastern time zone. 
  var nd = new Date(d.getTime() - ((d.getTimezoneOffset()-60) * 60000))
  const dayCount = getDayCountStr(nd.toJSON())

  const str = `select a.team_id as my_team_id, b.*
  from fantasy.rosters a, sports.schedule b
   where (a.team_id = b.home_team_id or a.team_id = b.away_team_id) 
   and b.status = 'Scheduled'
   and day_count >= ` + dayCount + ' and owner_id = \'' + ownerId + '\'  order by day_count limit 7'

  let resp = await knex.raw(str)

  return resp.rows.map(x => {
    let date = new Date(x.date_time)
    return {
      date:formatGameDateShort(date),
      time:formatAMPM(date),
      my_team_id : x.my_team_id,
      home_team_id: x.home_team_id,
      away_team_id: x.away_team_id,
      sport_id:x.sport_id
    }})
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

const updateTeamPointsTable = async (newTeamPoints) =>
{
  let results = await knex
    .withSchema('fantasy')
    .table('team_points')

  let oldTeamPoints = {}
  var updateList =[]
  results.map(result => {
    //console.log(result)
    if (!oldTeamPoints[result.sport_structure_id]){
      oldTeamPoints[result.sport_structure_id] = {}
    }
    oldTeamPoints[result.sport_structure_id][result.team_id] = result})
  newTeamPoints.map(teamPoints =>
  {
    //needs to be != because of 100.00 vs 100
    if(!oldTeamPoints[teamPoints.sport_structure_id][teamPoints.team_id] ||
      oldTeamPoints[teamPoints.sport_structure_id][teamPoints.team_id].reg_points != teamPoints.reg_points)
    {
      updateList.push(Promise.resolve(updateOneRowTeamPoints(teamPoints.sport_structure_id,teamPoints.team_id,'reg_points',teamPoints.reg_points )))
    }

    if(!oldTeamPoints[teamPoints.sport_structure_id][teamPoints.team_id] ||
      oldTeamPoints[teamPoints.sport_structure_id][teamPoints.team_id].bonus_points != teamPoints.bonus_points){
      updateList.push(Promise.resolve(updateOneRowTeamPoints(teamPoints.sport_structure_id,teamPoints.team_id,'bonus_points',teamPoints.bonus_points )))}
    
    if(!oldTeamPoints[teamPoints.sport_structure_id][teamPoints.team_id] ||
      oldTeamPoints[teamPoints.sport_structure_id][teamPoints.team_id].playoff_points != teamPoints.playoff_points){
      {
        updateList.push(Promise.resolve(updateOneRowTeamPoints(teamPoints.sport_structure_id,teamPoints.team_id,'playoff_points',teamPoints.playoff_points )))}
    }
  })
  
  if (updateList.length > 0)
  {
    return Promise.all(updateList)
      .then(() => {
        console.log('im done updating!')
        return updateList.length
      })
  }
  else
    return 0
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
            console.log('im done updating!')
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

const updateOneRowTeamPoints = (sport_structure_id,team_id, column, value ) =>
{
  return knex
    .withSchema('fantasy')
    .table('team_points')
    .where('sport_structure_id',sport_structure_id)
    .andWhere('team_id', parseInt(team_id))
    .update(column, value)
    .then(() =>
    {
      //console.log(column_link_val + " updated!")
    })
}

const getPointsStructure = async () => {
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

//below function is the same thing that is in helpers.
//Was unsure if could pull in the same structure
const activeSeasons = async () => {
  let today = new Date()

  let seasons = 
    await knex
      .withSchema('sports')
      .table('sport_season')
      .where('start_pull_date', '<', today)
      .andWhere('end_pull_date', '>', today)
      .select('*')
  
  return seasons
}
//this should be updated to do all the different team points structures
//similar to the way i did that before with the update fantasy projected points
//need to set up this table somewhere...
const updateTeamPoints = async () =>
{
  // let standings_for_update =
  //   await knex
  //     .withSchema('fantasy')
  //     .table('team_points')
  //     .leftOuterJoin('fantasy.sports_structure', 'fantasy.sports_structure.sport_structure_id', 'fantasy.team_points.sport_structure_id')
  //     .leftOuterJoin('fantasy.league_bundle', 'fantasy.sports_structure.league_bundle_id', 'fantasy.league_bundle.league_bundle_id')
  //     .select('*')
  
  //first - pulls all the sports structures
  let sport_structure = 
    await knex('fantasy.sports_structure')
      .leftOuterJoin('fantasy.league_bundle', 'fantasy.sports_structure.league_bundle_id', 'fantasy.league_bundle.league_bundle_id')
      .select('*')
  
  //this is the active seaons - so that we can filter out the not active seasons, and only pull data for the active ones
  let seasons = await activeSeasons()
  //we only want to pull standing data for active seasons. 
  //this means need to update the standings and playoff standings to have the sports season ids in there for both

  let seasons_for_pull = []
  seasons.forEach(season => {
    seasons_for_pull.push(season.sport_season_id)
  })

  let data = await getStandingDataPlayoffAndRegular(seasons_for_pull, sport_structure)
  //if we updated based on standings, then from each standing we would need the team id, and the year
  //then would pull from team_points based on those that had same year
  //we would then update those with active year...right?

  
  //what about if we updated based upon standings instead? what would that look like?

  let points = await getPointsStructure()

  //somewhere, this needs to check to be sure the league scoring type is 1 and input it here
  // let str = `select a.*, b.sport_id
  //     from fantasy.team_points a, sports.team_info b
  //     where a.team_id = b.team_id`
     
  let result = 
    await knex('fantasy.team_points')
      .innerJoin('sports.team_info', 'sports.team_info.team_id', 'fantasy.team_points.team_id')
      .select('fantasy.team_points.*', 'sports.team_info.sport_id')



  if (result.length > 0)
  {
    const teamPoints = result.map(fteam => {
      const team = data[fteam.sport_structure_id][fteam.team_id]
      //const league = points.filter(league => league.sport_id == fteam.sport_id)[0]
      if(team){
        let sport_id = fteam.sport_id
        let bonus_win=0
        let status = Number(team.playoff_status)

        if(sport_id === '103' || sport_id==='104'){
          let milestone_parameter = sport_id === '103' ? team.wins : team.wins*2//+team.ties
          let milestone_points = points[fteam.scoring_type_id][sport_id].regular_season.milestone_points
          bonus_win = milestone_parameter < points[fteam.scoring_type_id][sport_id].regular_season.milestones[0] ? 0 :
            milestone_parameter < points[fteam.scoring_type_id][sport_id].regular_season.milestones[1] ? milestone_points :
              milestone_parameter < points[fteam.scoring_type_id][sport_id].regular_season.milestones[2] ? milestone_points*2 : milestone_points*3
        }
        
        let bonus_points = status > 5 ? points[fteam.scoring_type_id][sport_id].bonus.championship + points[fteam.scoring_type_id][sport_id].bonus.finalist + points[fteam.scoring_type_id][sport_id].bonus.appearance :
          status > 4 ? points[fteam.scoring_type_id][sport_id].bonus.finalist + points[fteam.scoring_type_id][sport_id].bonus.appearance :
            status > 2 ? points[fteam.scoring_type_id][sport_id].bonus.appearance : 0
        fteam.reg_points = points[fteam.scoring_type_id][sport_id].regular_season.win * team.wins + points[fteam.scoring_type_id][sport_id].regular_season.tie * team.ties
        fteam.playoff_points = points[fteam.scoring_type_id][sport_id].playoffs.win * team.playoff_wins
        //below depends on how we format bowl wins
        sport_id === '105' ? fteam.playoff_points += (points[fteam.scoring_type_id][sport_id].playoffs.bowl_win * team.bowl_wins) : 0
        fteam.bonus_points = bonus_win + bonus_points
        return fteam}
    })

    let resp = await updateTeamPointsTable(teamPoints)
    console.log('Number of Teams Updated: ' + resp)

  }

}

const updateLeagueProjectedPoints = async (league_id) => {
  const math = require('mathjs')

  //this needs to be fixed so it works, but this should be on fantasy.sport_structure_id
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
  })

    
  let fantasyPoints = [].concat.apply([], addingRank)
  console.log(fantasyPoints)
  process.exit()
  return updatePointsTable(fantasyPoints, true)
    .then(result => {
      console.log('Number of Fantasy Points Updated: ' + result)
      return 0
    })

  
}

//runs for each league to run points
//not sure if this is set up to run for each and every league - this hsould match up leagues with sport structure id
const updateLeaguePoints = (league_id) =>

{

  //check the and part of this raw statement to be sure it works
  let str = league_id
    ? `select a.reg_points, a.bonus_points, a.playoff_points, b.owner_id, b.league_id 
    from fantasy.team_points a, fantasy.rosters b, fantasy.leagues c 
    where a.team_id = b.team_id 
    and c.league_id = b.league_id 
    and c.sport_structure_id = a.sport_structure_id 
    and b.league_id = '` + league_id + '\''
    : `select a.reg_points, a.bonus_points, a.playoff_points, b.owner_id, b.league_id
    from fantasy.team_points a, fantasy.rosters b, fantasy.leagues c 
    where a.team_id = b.team_id 
    and c.league_id = b.league_id 
    and c.sport_structure_id = a.sport_structure_id`

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

const getStandingDataPlayoffAndRegular = async (seasons_for_pull, sport_structure) =>
{
  //this needs to be fixed to have playoff_standings.sport_season_id be separate from other id
  let standings = 
    await knex('sports.standings')
      .leftOuterJoin('sports.playoff_standings', function(){
        this.on('sports.standings.team_id', '=', 'sports.playoff_standings.team_id').andOn('sports.standings.year', '=', 'sports.playoff_standings.year')
      })
      .whereIn('sports.standings.sport_season_id', seasons_for_pull)
      .orWhereIn('sports.playoff_standings.sport_season_id', seasons_for_pull)
      .select('*')
  
  let teamMap = {}
  //let season_ids = []
  sport_structure.forEach(structure => {
    //console.log('structure id', structure.sport_structure_id)
    teamMap[structure.sport_structure_id] = {}
    //console.log('current sport seasons',structure.current_sport_seasons)
    if(structure.current_sport_seasons.length > 0){
      standings.forEach(team => {
        //let m = 0
        //use includes below
        if(structure.current_sport_seasons.includes(team.sport_season_id)){
          teamMap[structure.sport_structure_id][team.team_id] = {...team}
        }
      })
    }
  })

 
  return teamMap
}

const updateFantasy = (league_id, res) =>
{
  updateLeaguePoints(league_id)
    .then(() => handleReduxResponse(res, 200, {type: C.SAVED_DRAFT}))
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
const formatGameDateShort = (date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()

  return `${month}/${day}/${year-2000}`
}


module.exports = {
  getLeague,
  getDayCount,
  updateTeamPoints,
  updateLeaguePoints,
  updateLeagueProjectedPoints,
  updateFantasy,
  getDayCountStr,
  formatAMPM,
  formatGameDate,
  GetDraftOrder,
  GetSportSeasonsByLeague
}

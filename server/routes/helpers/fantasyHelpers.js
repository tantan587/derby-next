const knex = require('../../db/connection')
const C = require('../../../common/constants')

function handleReduxResponse(res, code, action){
  res.status(code).json(action)
}

const getLeague = (league_id, res, type) =>{


  var str = `select a.*, b.username, c.league_name, c.max_owners, c.league_id, d.total_points, d.rank, e.total_teams from
  fantasy.owners a, users.users b, fantasy.leagues c, fantasy.points d,
   (select league_id, sum(number_teams) as total_teams from fantasy.sports where league_id = '` + league_id + '\' group by league_id) e' +
  ' where a.league_id = e.league_id and a.user_id = b.user_id and a.league_id = c.league_id and a.owner_id = d.owner_id'
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0) 
      {
        var league_name = result.rows[0].league_name
        var max_owners = result.rows[0].max_owners
        var league_id = result.rows[0].league_id
        var total_teams = result.rows[0].total_teams
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
          owners : owners
        })
      }
      else
      {
        return handleReduxResponse(res,400, {})
      }
    })


}

const updateAllFantasy = updateFantasyPoints()

async function updateFantasyPoints(league_id) {
  let data = await getStandingData()
  let points = [
    {sport_id: 101, win:3, tie:0},
    {sport_id: 102, win:15, tie:0},
    {sport_id: 103, win:2, tie:0},
    {sport_id: 104, win:3.5, tie:1.75},
    {sport_id: 105, win:16.75, tie:0},
    {sport_id: 106, win:7, tie:0},
    {sport_id: 107, win:6.75, tie:2.25}]

  
  let str = league_id 
    ? 'select a.*, b.sport_id from fantasy.rosters a, sports.team_info b where a.sports_team_id = b.team_id and a.league_id = \'' + league_id + '\''
    : 'select a.*, b.sport_id from fantasy.rosters a, sports.team_info b where a.sports_team_id = b.team_id'
  
  return knex.raw(str)
    .then(result =>
    {
      if (result.rows.length > 0) 
      {
        const rosters = result.rows.map(fteam => {
          const team = data[fteam.sports_team_id]
          const league = points.filter(league => league.sport_id == fteam.sport_id)[0]
          fteam.reg_points = league.win * team.wins + league.tie * team.ties
          fteam.bonus_points = 0
          return fteam}) 

        let byOwner = {}
        rosters.map(roster => {
          if (!(roster.owner_id in byOwner))
          {
            byOwner[roster.owner_id] = {total_points:0, league_id:roster.league_id, owner_id:roster.owner_id}
          }
          byOwner[roster.owner_id].total_points += roster.reg_points + roster.bonus_points
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
        let newRosters = rosters.map(roster => {return {...roster}})

        updateRosters(newRosters)
          .then(result => {
            console.log('Number of Rosters Updated: ' + result)
            updatePoints(fantasyPoints)
              .then(result2 => {
                console.log('Number of Fantasy Points Updated: ' + result2)
                return 0
                //process.exit()
              })
          })
        

        //console.log(fantasyPoints)
      }
    })
}

const updateRosters = (newRosters) =>
{
  //console.log(newRosters)
  return knex
    .withSchema('fantasy')
    .table('rosters')
    .then(results => {
      let oldRosters = {}
      var updateList =[]
      results.map(result => {
        if (!oldRosters[result.owner_id]){
          oldRosters[result.owner_id] = {}
        }
        oldRosters[result.owner_id][result.sports_team_id] =result})
      newRosters.map(roster =>
      {
        //needs to be != because of 100.00 vs 100
        if(oldRosters[roster.owner_id][roster.sports_team_id].reg_points != roster.reg_points)
        {
          updateList.push(Promise.resolve(updateOneRowRosters(roster.owner_id,roster.sports_team_id,'reg_points',roster.reg_points )))
        }  
         
        if(oldRosters[roster.owner_id][roster.sports_team_id].bonus_points != roster.bonus_points)  
          updateList.push(Promise.resolve(updateOneRowRosters(roster.owner_id,roster.sports_team_id,'bonus_points',roster.bonus_points )))
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

const updatePoints = (newPoints) =>
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

const updateOneRowRosters = (owner_id,sports_team_id, column, value ) =>
{
  return knex
    .withSchema('fantasy')
    .table('rosters')
    .where('owner_id',owner_id)
    .andWhere('sports_team_id',sports_team_id)
    .update(column, value)
    .then(() =>
    {
      //console.log(column_link_val + " updated!")
    })
}

async function getStandingData()
{
  return knex.withSchema('sports').table('standings').select('*')
    .then(result => {
      let teamMap = {}
      result.map(team => {teamMap[team.team_id] = {...team}})
      return teamMap
    })
}

const updateFantasy = (league_id, res) =>
{
  updateFantasyPoints(league_id)
    .then(() => handleReduxResponse(res, 200, {type: C.SAVED_DRAFT}))
}



//const getSports

module.exports = {
  getLeague,
  updateAllFantasy,
  updateFantasy
}
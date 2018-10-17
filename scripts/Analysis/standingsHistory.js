const knex = require('../../server/db/connection')
const getDayCount = require('./dayCount.js')
const asyncForEach = require('../asyncForEach')

//function that pulls all the recent games of a team, going x amount of days back
const pullGamesByTeam = async (team_id, days, past=true) => {
    let todayDayCount = getDayCount(new Date())
    let dayCountRange = past ? [todayDayCount-days, todayDayCount] : [todayDayCount, todayDayCount+days]
    let recentGames =
        await knex('sports.schedule')
            .where(function(){
                this.where('home_team_id', team_id).orWhere('away_team_id',team_id)})
            .andWhereBetween('day_count', dayCountRange)
            .select('*')

    return recentGames
}

//puts all team_ids one owner has on roster into a list form
const oneOwnerRoster = async (owner_id) => {
    let roster =
        await knex('fantasy.rosters')
            .where('owner_id', owner_id)
            .select('team_id')
    
    let owner_teams = roster.map(team => {return team.team_id})
    return owner_teams
}

// pullRecentGames('102101', 28)

//oneOwnerRoster('8046e06a-6954-44da-a9d9-7dbe5ba251dc')

const recordByTeamSchedule = (team_id, schedule) => {
    let teamRecord = {win: 0, loss: 0, tie: 0}
    schedule.forEach(game => {
        if(game.home_team_id===team_id){
            game.winner === 'H' ? teamRecord.win++ : game.winner === 'A' ? teamRecord.loss++ : teamRecord.tie++ 
        }else if(game.away_team_id === team_id){
            game.winner === 'A' ? teamRecord.win++ : game.winner === 'H' ? teamRecord.loss++ : teamRecord.tie++ 
        }
    })
    tieText = teamRecord.tie===0 ? '' : `-${teamRecord.tie}`
    teamRecord.text = `${teamRecord.win}-${teamRecord.loss}${tieText}`
    return teamRecord
}


const ownerTeamRecords = async (owner_id, days_back) => {
    let ownerTeams = await oneOwnerRoster(owner_id)
    let ownerTeamRecords = {}
    await asyncForEach(ownerTeams, async (team) => {
        let teamSchedule = await pullGamesByTeam(team, days_back)
        let teamRecord = recordByTeamSchedule(team, teamSchedule)
        ownerTeamRecords[team] = {...teamRecord}
    })
    console.log(ownerTeamRecords)
}

const getLeagueStandings = async (league_id) => {
    let standings = 
        await knex('fantasy.owners')
            .where('league_id', league_id)
            .leftOuterJoin('fantasy.points', 'fantasy.points.owner_id', 'fantasy.owners.owner_id')
            .select('*')
    
    return standings    
}

//pulls the League Id with just the owner id
const pullLeagueIdByOwner  = async (owner_id) => {
    let league_id =
        (await knex('fantasy.rosters')
            .where('owner_id', owner_id)
            .limit(1)
            .select('league_id'))[0].league_id
    
    return league_id
}

const upcomingGames = async (owner_id, days_forward) => {
    let ownerTeams = await oneOwnerRoster(owner_id)
    let ownerGames = {}
    let allTeamGames = []
    await asyncForEach(ownerTeams, async (team) => {
        let teamSchedule = await pullGamesByTeam(team, days_forward, false)
        ownerGames[team] = {...teamSchedule}
        allTeamGames.push(...teamSchedule)
        
    })
    return allTeamGames
}



const emailBuildFunction = async (owner_id) => {
    let league_id = await pullLeagueIdByOwner(owner_id)
    let leagueStandings = await getLeagueStandings(league_id)

    let upcomingTeamGames = await upcomingGames(owner_id, 7)
    upcomingTeamGames.sort((a,b) => {return b.day_count - a.day_count})
    let gamesByDayCount = {}
    upcomingGames.forEach(game => {
        if(game.day_count in gamesByDayCount){
            gamesByDayCount[game.day_count] = []
        }
        gamesByDayCount.push()
    })
}

ownerTeamRecords('8046e06a-6954-44da-a9d9-7dbe5ba251dc', 28)
//emailBuildFunction('8046e06a-6954-44da-a9d9-7dbe5ba251dc')
const asyncForEach = require('../asyncForEach')
const math = require('mathjs')
const dayCount = require('./dayCount.js')

const updateGameProjections = async (knex, game_projections) => {
    let raw_current_projections = await knex('analysis.game_projections').select('global_game_id')
    let current_projections = raw_current_projections.map(game => {return game.global_game_id})
    let updateList = []
    
    game_projections.forEach(game => {
        if(current_projections.includes(game.global_game_id)){
            updateList.push(Promise.resolve(updateOneGameProjectionRow(knex, game.global_game_id, game)))
        }else{
            updateList.push(Promise.resolve(insertOneGameProjectionRow(knex, game)))
        }
    })

    return Promise.all(updateList)
    .then(()=>{
        return updateList.length
    })
}

const updateFantasyProjections = async (knex, fantasy_projections) => {
    let current_projections = 
        await knex('fantasy.projections').select('*')
    
    let oldProjections = {}
    let deleteList = {}
    current_projections.forEach(projection => {
        if(!(projection.sport_structure_id in oldProjections)){
            oldProjections[projection.sport_structure_id] = {}
            deleteList[projection.sport_structure_id] = []
        }
        oldProjections[projection.sport_structure_id][projection.team_id] = projection 
    })

    fantasy_projections.forEach(team => {
        //console.log(team.sport_structure_id)
        if(team.sport_structure_id in oldProjections && team.team_id in oldProjections[team.sport_structure_id]){
            deleteList[team.sport_structure_id].push(team.team_id)
        }
    })

    await deleteAndUpdateFantasyProjections(knex, deleteList, fantasy_projections)
}

const deleteAndUpdateFantasyProjections = async (knex, deleteList, newProjections) => {
    
    await asyncForEach(Object.keys(deleteList), async (sport_structure_id) => {
        console.log(sport_structure_id)
        await knex('fantasy.projections')
            .where('sport_structure_id', sport_structure_id)
            .whereIn('team_id', deleteList[sport_structure_id])
            .del()
    })

    await knex('fantasy.projections').insert(newProjections)
}

const updateRecordProjections = async (knex, record_projections, all) => {
    if(all){
        await knex('analysis.record_projections').insert(record_projections)
    }else{
        let current_projections = 
            await knex('analysis.record_projections')
                .leftOuterJoin('sports.team_info', 'sports.team_info.team_id', 'analysis.record_projections.team_id')
                .select('analysis.record_projections.*', 'sports.team_info.sport_id')

        let max = math.max(current_projections.map(team => team.day_count))

        let today = new Date()

        let seasons = 
            await knex('sports.sport_season')
                .whereNot('season_type', 2)
                .select('*')
        
        let sport_years = {}
        seasons.forEach(season => {
            if(!(season.sport_id in sport_years)){
                sport_years[season.sport_id] = {}
            }
            if(!(season.year in sport_years[season.sport_id])){
                sport_years[season.sport_id][season.year] = {'start_date': 0, 'end_date': 0}
            }
            if(season.season_type === 3){
                sport_years[season.sport_id][season.year].end_date = season.end_pull_date
            }
            if(season.season_type === 1){
                sport_years[season.sport_id][season.year].start_date = season.start_season_date
            }
        })
        let today_day_count = dayCount(today)
        let sport_years_for_update = {}
        Object.keys(sport_years).forEach(sport_id => {
            Object.keys(sport_years[sport_id]).forEach(year => {
                if(sport_years[sport_id][year].start_date < today && sport_years[sport_id][year].end_date > today){
                    sport_years_for_update[sport_id] = year
                }
            })
        })

        //only problem with above method is it will update when games aren't in progress
        //so for nfl, midweek. Epl, midweek

        // let new_current_projections = current_projections.filter(team => {return team.day_count === max})

        // let oldProjections = {}
        // new_current_projections.forEach(projection => {
        //     if(!(projection.sport_id in oldProjections)){
        //         oldProjections[projection.sport_id] = {}
        //     }
        //     if(!(projection.year in oldProjections[projection.sport_id])){
        //         oldProjections[projection.sport_id][projection.year] = {}
        //     }
        //     oldProjections[projection.sport_id][projection.year][projection.team_id] = projection.day_count
        // })

        let updateList = []
        record_projections.forEach(projection => {
            sport_id = math.floor(projection.team_id/1000)
            if(sport_years_for_update[sport_id] <= projection.year){
                if(max == today_day_count){
                    updateList.push(Promise.resolve(updateOneRecordProjectionRow(knex, projection.team_id, projection.year, today_day_count, projection)))
                }else{
                    updateList.push(Promise.resolve(insertOneRecordProjectionRow(knex, projection)))
                }
            }
        })

        return Promise.all(updateList)
        .then(()=>{
            return 0
        })
    }
}

const insertOneRecordProjectionRow = async (knex, row) => {
    await knex('analysis.record_projections')
        .insert(row)
}

const updateOneRecordProjectionRow = async (knex, team_id, year, day_count, row) => {
    await knex('analysis.record_projections')
        .where('team_id', team_id)
        .andWhere('year', year)
        .andWhere('day_count', day_count)
        .del()

    await insertOneRecordProjectionRow(knex, row)
}

const updateOneGameProjectionRow = async (knex, global_game_id, row) =>
{
    await knex('analysis.game_projections')
        .where('global_game_id', global_game_id)
        .update(row)
}

const insertOneGameProjectionRow = async (knex, row) =>
{
  await knex
    .withSchema('analysis')
    .table('game_projections')
    .insert(row)
}

module.exports = {
    updateGameProjections,
    updateFantasyProjections, 
    updateRecordProjections
}
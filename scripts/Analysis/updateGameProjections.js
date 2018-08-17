
const updateGameProjections = async (knex, game_projections) => {
    let raw_current_projections = await knex('analysis.game_projections').select('global_game_id')
    let current_projections = raw_current_projections.map(game => {return game.global_game_id})
    let updateList = []
    
    game_projections.forEach(game => {
        if(current_projections.includes(game.global_game_id)){
            updateList.push(Promise.resolve(updateOneProjectionRow(knex, game.global_game_id, game)))
        }else{
            updateList.push(Promise.resolve(insertOneProjectionRow(knex, game)))
        }
    })

    return Promise.all(updateList)
    .then(()=>{
        return updateList.length
    })
}

updateOneProjectionRow = async (knex, global_game_id, row) =>
{
    await knex('analysis.game_projections')
        .where('global_game_id', global_game_id)
        .update(row)
}

insertOneProjectionRow = async (knex, row) =>
{
  await knex
    .withSchema('analysis')
    .table('game_projections')
    .insert(row)
}

module.exports = updateGameProjections
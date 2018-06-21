const getPointsStructure = async (knex) => {
  return knex
    .withSchema('fantasy')
    .table('scoring')
    .then((points)=>{
      let point_map = []
      let point_structures = []
      points.forEach(structure => {
        if(point_structures.includes(structure.scoring_type_id)){
            point_map[structure.scoring_type_id-1][structure.sport_id] = {...structure}
        }else{
            point_map[structure.scoring_type_id-1] = {}
            point_map[structure.scoring_type_id-1][structure.sport_id] = {...structure}
            point_structures.push(structure.scoring_type_id)
        }
      })
      return point_map
    })
  }

module.exports = {getPointsStructure}
const knex = require('../../server/db/connection')
//make this into a seed
const data = [
    {sport_id:102, scoring_type_id: 1, name: "default", regular_season: {win: 15, tie: 0}, playoffs: {win: 15, bye: 15}, bonus: {championship: 20, finalist: 20, appearance: 20}},
    {sport_id:101, scoring_type_id: 1, name: "default", regular_season: {win: 3, tie: 0}, playoffs: {win: 3}, bonus: {championship: 20, finalist: 20, appearance: 20}},
    {sport_id:103, scoring_type_id: 1, name: "default", regular_season: {win: 2, tie: 0, milestone_points: 15, milestone_1: 81, milestone_2: 90, milestone_3: 99}, playoffs: {win: 5, bye:5}, bonus: {championship: 20, finalist: 20, appearance: 20}},
    {sport_id:104, scoring_type_id: 1, name: "default", regular_season: {win: 4, tie: 2, milestone_points: 15, milestone_1: 92, milestone_2: 100, milestone_3: 109}, playoffs: {win: 4}, bonus: {championship: 20, finalist: 20, appearance: 20}},
    {sport_id:105, scoring_type_id: 1, name: "default", regular_season: {win: 18, tie: 0}, playoffs: {win: 25, bowl_win: 18}, bonus: {championship: 20, finalist: 20, appearance: 20}},
    {sport_id:106, scoring_type_id: 1, name: "default", regular_season: {win: 7, tie: 0}, playoffs: {win: 7}, bonus: {championship: 20, finalist: 20, appearance: 20}},
    {sport_id:107, scoring_type_id: 1, name: "default", regular_season: {win: 6, tie: 2}, playoffs: {win: 0}, bonus: {championship: 20, finalist: 20, appearance: 20}}
]

return knex
    .withSchema('fantasy')
    .table('scoring')
    .insert(data)
    .then(()=>{
        console.log('done!')
        process.exit()
    })



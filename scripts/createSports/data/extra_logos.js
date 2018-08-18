const asyncForEach = require('../../asyncForEach')

const additional_logos = [{team_id: 106108, logo_url: 'https://en.wikipedia.org/wiki/Butler_Bulldogs#/media/File:Butler_Bulldogs_logo.svg'},

  {team_id: 106112, logo_url: 'https://en.wikipedia.org/wiki/Creighton_Bluejays#/media/File:Creighton_Bluejays_logo.svg'},

  {team_id: 106113, logo_url: 'https://en.wikipedia.org/wiki/DePaul_Blue_Demons#/media/File:DePaul_Blue_Demons_logo.svg'},

  {team_id: 106117, logo_url: 'https://en.wikipedia.org/wiki/Georgetown_Hoyas#/media/File:Georgetown_Hoyas_logo.svg'},

  {team_id: 106119, logo_url: 'https://en.wikipedia.org/wiki/Marquette_Golden_Eagles#/media/File:Marquette_Golden_Eagles_logo.svg'},

  {team_id: 106150, logo_url: 'https://en.wikipedia.org/wiki/Providence_Friars#/media/File:Providence_Friars_logo.svg'},

  {team_id: 106155, logo_url: 'https://en.wikipedia.org/wiki/File:St._John%27s_Red_Storm_logo.svg'},

  {team_id: 106153, logo_url: 'https://en.wikipedia.org/wiki/Seton_Hall_Pirates#/media/File:Seton_Hall_Pirates_logo.svg'},

  {team_id: 106175, logo_url: 'https://en.wikipedia.org/wiki/Xavier_Musketeers#/media/File:Xavier_Musketeers_logo.svg'},

  {team_id: 106441, logo_url: 'https://en.wikipedia.org/wiki/Wichita_State_Shockers#/media/File:Wichita_State_Shockers_logo.svg'},

  {team_id: 107103, logo_url: 'https://en.wikipedia.org/wiki/Brighton_%26_Hove_Albion_F.C.#/media/File:Brighton_%26_Hove_Albion_logo.svg'},

  {team_id: 107121, logo_url: 'https://en.wikipedia.org/wiki/Cardiff_City_F.C.#/media/File:Cardiff_City_crest.svg'},

  {team_id: 107122, logo_url: 'https://en.wikipedia.org/wiki/Fulham_F.C.#/media/File:Fulham_FC_(shield).svg'},

  {team_id: 107108, logo_url: 'https://en.wikipedia.org/wiki/Huddersfield_Town_A.F.C.#/media/File:Huddersfield_Town_A.F.C._logo.svg'},

  {team_id: 107123, logo_url: 'https://en.wikipedia.org/wiki/Wolverhampton_Wanderers_F.C.#/media/File:Wolverhampton_Wanderers.svg'}]

let addLogos = async (knex) => {
  await asyncForEach(additional_logos, async (team) =>{
    await knex('sports.team_info')
      .where('team_id', team.team_id)
      .update('logo_url', team.logo_url)
  })
  console.log('done')
}

module.exports = {addLogos}
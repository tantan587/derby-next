const asyncForEach = require('../../asyncForEach')

const additional_logos = [
  
  {team_id: 106108, logo_url: 'https://upload.wikimedia.org/wikipedia/en/0/06/Butler_Bulldogs_logo.svg'},

  {team_id: 106112, logo_url: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Creighton_Bluejays_logo.svg'},

  {team_id: 106113, logo_url: 'https://upload.wikimedia.org/wikipedia/en/7/79/DePaul_Blue_Demons_logo.svg'},

  {team_id: 106117, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Georgetown_Hoyas_logo.svg'},

  {team_id: 106129, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Marquette_Golden_Eagles_logo.svg'},

  {team_id: 106150, logo_url: 'https://upload.wikimedia.org/wikipedia/en/9/9d/Providence_Friars_logo.svg'},

  {team_id: 106155, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/6/62/St._John%27s_Red_Storm_logo.svg'},

  {team_id: 106153, logo_url: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Seton_Hall_Pirates_logo.svg'},

  {team_id: 106175, logo_url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Xavier_Musketeers_logo.svg'},

  {team_id: 106441, logo_url: 'https://upload.wikimedia.org/wikipedia/en/9/90/Wichita_State_Shockers_logo.svg'},

  {team_id: 107103, logo_url: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg'},

  {team_id: 107121, logo_url: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Cardiff_City_crest.svg'},

  {team_id: 107122, logo_url: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg'},

  {team_id: 107108, logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/5a/Huddersfield_Town_A.F.C._logo.svg'},

  {team_id: 107123, logo_url: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg'}]

let addLogos = async (knex) => {
  await asyncForEach(additional_logos, async (team) =>{
    await knex('sports.team_info')
      .where('team_id', team.team_id)
      .update('logo_url', team.logo_url)
  })
  console.log('done')
}

module.exports = {addLogos}
const League = require('../../server/source/League')
const Team = require('../../server/source/Team')
//const Owner = require('../../server/source/Owner')
const Record = require('../../server/source/Record')
const OwnerBuilder = require('../../server/source/OwnerBuilder')


const  buildIt = async () => {

  let league = new League('87cf6bb3-d3b0-4f61-9bc3-a8e873dd8fd2')
  await league.Create()
  //console.log(league.Create(''))

  //let record = new Record(3,2,1)
  //let team = new Team(3,23)
  //console.log(team.GetRecord(2))
  
}

buildIt()
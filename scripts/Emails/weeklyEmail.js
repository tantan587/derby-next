const League = require('../../server/source/League')
const authHelpers = require('../../server/routes/helpers/authHelpers')
const weeklyEmailTemplate = require('../../server/email-templates/weeklyEmail')
const fs = require('pn/fs')

const svg2png = require('svg2png')
 

const  buildIt = async () => {
 

  fs.readFile('./static/icons/Silks/derby_silk_avatar_star.svg', 'utf8', function(err, contents) {
//.cls-1{fill:#ccc;}.cls-2{fill:#231f20;}
    let temp = contents.replace('.cls-1{fill:#ccc;}.cls-2{fill:#231f20;}', '.cls-1{fill:#873eb2;}.cls-2{fill:#a3e251;}')
    fs.writeFile('./static/icons/Silks/test.svg', temp)
      .then(() => {
        fs.readFile('./static/icons/Silks/test.svg')
          .then((buffer) => svg2png(buffer, {height:300, width:300}))
          .then(buffer => fs.writeFile('./static/icons/Silks/test1.png', buffer))
          .catch(e => console.error(e))
      })
      
    console.log('The file was saved!')
  })



  
  

  // let league = new League('87cf6bb3-d3b0-4f61-9bc3-a8e873dd8fd2')
  // await league.Create()

  // let user = {}
  // user.email = 'yoni.h.silverman@gmail.com'
  // user.first_name = 'Jon'
  // user.password = 'Hello'

  // authHelpers.sendEmail(user, weeklyEmailTemplate)
  //   .then(() => process.exit())
  
}

buildIt()
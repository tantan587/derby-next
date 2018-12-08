const League = require('../../server/source/League')
const authHelpers = require('../../server/routes/helpers/authHelpers')
const weeklyEmailTemplate = require('../../server/email-templates/weeklyEmail')
const fs = require('pn/fs')
const svg2png = require('svg2png')
const Colors = require('../../common/components/Icons/Avatars/Colors')
const Patterns = require('../../common/components/Icons/Avatars/Patterns')
 

const  buildIt = async () => {
 
  let league = new League('87cf6bb3-d3b0-4f61-9bc3-a8e873dd8fd2')
  await league.Create()
  let primary = Colors[league.Owners[3].Avatar.primary]
  let secondary = Colors[league.Owners[3].Avatar.secondary]
  let file = Patterns[league.Owners[3].Avatar.pattern].file


  fs.readFile(file, 'utf8', function(err, contents) {
    let temp = contents.replace('.cls-1{fill:#ccc;}.cls-2{fill:#231f20;}.cls-3{fill:#fff;}',
      '.cls-1{fill:#000;}.cls-2{fill:'+primary+';}.cls-3{fill:'+secondary+';}')
    fs.writeFile('./static/icons/Silks/test.svg', temp)
      .then(() => {
        fs.readFile('./static/icons/Silks/test.svg')
          .then((buffer) => svg2png(buffer, {height:300, width:300}))
          .then(buffer => 
            fs.writeFile('./static/icons/Silks/test1.png', buffer)
              .then(() => process.exit())
          )
          .catch(e => console.error(e))
      })
      
    console.log('The file was saved!')
  })



  
  

  
  // let user = {}
  // user.email = 'yoni.h.silverman@gmail.com'
  // user.first_name = 'Jon'
  // user.password = 'Hello'

  // authHelpers.sendEmail(user, weeklyEmailTemplate)
  //   .then(() => process.exit())
  
}

buildIt()
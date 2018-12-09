const League = require('../../server/source/League')
const authHelpers = require('../../server/routes/helpers/authHelpers')
const weeklyEmailTemplate = require('../../server/email-templates/weeklyEmail')
const fs = require('pn/fs')
const svg2png = require('svg2png')
const Colors = require('../../common/components/Icons/Avatars/Colors')
const Patterns = require('../../common/components/Icons/Avatars/Patterns')
 

const  buildIt = async () => {
 
  let user = {}
  user.email = 'yoni.h.silverman@gmail.com'
  
  let league = new League('87cf6bb3-d3b0-4f61-9bc3-a8e873dd8fd2')
  await league.Create()
  user.Owners = league.Owners


  let cb = async (x,i) => {
    let primary = Colors[x.Avatar.primary]
    let secondary = Colors[x.Avatar.secondary]
    let file = Patterns[x.Avatar.pattern].file
  
    let contents = await fs.readFile(file, 'utf8') 
    let temp = contents.replace('.cls-1{fill:#ccc;}.cls-2{fill:#231f20;}.cls-3{fill:#fff;}',
      '.cls-1{fill:#000;}.cls-2{fill:'+secondary+';}.cls-3{fill:'+primary+';}')
    await fs.writeFile('./static/icons/Silks/test.svg', temp)
  
    let buffer = await fs.readFile('./static/icons/Silks/test.svg')
    buffer = await svg2png(buffer, {height:300, width:300})
    await fs.writeFile('./server/email-templates/test'+i+'.png', buffer)
  }
  
  for (let index = 0; index < 4; index++) {
    console.log(index)
    await cb(league.Owners[index], index)
  }

  await authHelpers.sendEmail(user, weeklyEmailTemplate)
  process.exit()
   
}

buildIt()
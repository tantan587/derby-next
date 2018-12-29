const League = require('../../server/source/League')
const authHelpers = require('../../server/routes/helpers/authHelpers')
const weeklyEmailTemplate = require('../../server/email-templates/weeklyEmail')
const fs = require('pn/fs')
const https = require('https')
const svg2png = require('svg2png')
const Colors = require('../../common/components/Icons/Avatars/Colors')
const Patterns = require('../../common/components/Icons/Avatars/Patterns')
 

const  buildIt = async () => {
  // const path = require('path')
  // const image3 = path.join(__dirname, '/test3.png')
  // console.log(image3)
  // process.exit()
  
 
  // let buffer = await fs.readFile('./static/icons/EmailTest/test.svg')
  // buffer = await svg2png(buffer, {height:412, width:1200})
  // await fs.writeFile('./server/email-templates/stands.png', buffer)

  let user = {}
  user.email ='yoni.h.silverman@gmail.com'//'perry.gattegno@gmail.com'
  
  let league = new League('87cf6bb3-d3b0-4f61-9bc3-a8e873dd8fd2')
  await league.Create()
  user.Owners = league.Owners

  const file1 = fs.createWriteStream('./static/icons/Silks/newyorktest.svg')
  let resp = await doRequest()
  await resp.pipe(file1)


  let cb = async (x,i) => {
    let primary = Colors[x.Avatar.primary]
    let secondary = Colors[x.Avatar.secondary]
    let file = Patterns[x.Avatar.pattern].file
  
    let contents = await fs.readFile(file, 'utf8') 
    let temp = contents.replace('.cls-1{fill:#ccc;}.cls-2{fill:#231f20;}.cls-3{fill:#fff;}',
      '.cls-1{fill:#000;}.cls-2{fill:'+secondary+';}.cls-3{fill:'+primary+';}')
    await fs.writeFile('./static/icons/Silks/test.svg', temp)

    
    let buffer = await (i == 2 ? fs.readFile('./static/icons/Silks/newyorktest.svg') : 
      fs.readFile('./static/icons/Silks/test.svg'))
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


let doRequest = () => {
  return new Promise ((resolve, reject) => {
    let req = https.get('https://upload.wikimedia.org/wikipedia/en/6/6b/New_York_Jets_logo.svg')

    req.on('response', res => {
      resolve(res)
    })

    req.on('error', err => {
      reject(err)
    })
  })
}

buildIt()


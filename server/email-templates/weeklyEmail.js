const path = require('path')
//const dev = process.env.NODE_ENV !== 'production'
const header = path.join(__dirname, '/Derby_Email_headline_Welcome-to-Derby_2.jpg')
const header1 = path.join(__dirname, '/stands.png')
const footer1 = path.join(__dirname, '/Derby_Email_sports_icons_2x.png')
const footer2 = path.join(__dirname, '/Derby_Email_footer_newest.png')
const image0 = path.join(__dirname, '/test0.png')
const image1 = path.join(__dirname, '/test1.png')
const image2 = path.join(__dirname, '/test2.png')
const image3 = path.join(__dirname, '/test3.png')

const forgotpasswordSubject = () => '[Derby] Weekly Report'

const createInline = () => [header, header1, footer1, footer2, image0, image1, image2, image3]

const forgotpasswordBody = (user) => {
  //const HOST = dev ? 'http://localhost:3000' : 'http://www.derby-fwl.com'
  //const LINK = `${HOST}/createpassword`
  return (`
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
        <div>
          <img src="cid:Derby_Email_headline_Welcome-to-Derby_2.jpg" width="600" height="181">
          </div>
          <div>
          <img src="cid:stands.png" width="600">
          </div>
          <div style="width: 600px; font-family: 'Roboto'; font-size: 1.2em; margin: 30px; color: 'black';">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr style="font-family: 'Roboto'; font-size: 1.4em;">
                 <td width="25%" style="text-align:center">
                  <span>1st</span>
                 </td>
                 <td width="25%" style="text-align:center">
                  <span>2nd</span>
                 <td width="25%" style="text-align:center">
                  <span>3rd</span>
                 </td>
                 <td width="25%" style="text-align:center">
                  <span>4th</span>
                 </td>
               </tr>
               <tr height="10px"></tr>
               <tr>
                 <td width="25%" style="text-align:center">
                <img src="cid:test0.png" width="100" height="100">
                 </td>
                 <td width="25%" style="text-align:center">
                <img src="cid:test1.png" width="100" height="100">
                 </td>
                 <td width="25%" style="text-align:center">
                <img src="cid:test2.png" width="100" height="100">
                 </td>
                 <td width="25%" style="text-align:center">
                <img src="cid:test3.png" width="100" height="100">
                 </td>
               </tr>
               <tr height="10px">
               </tr>
               <tr  style="font-family: 'Roboto'; font-size: 1.0em;">
                 <td width="25%" style="text-align:center">
                  <span>${user.Owners[0].OwnerName}</span>
                 </td>
                 <td width="25%" style="text-align:center">
                  <span>${user.Owners[1].OwnerName}</span>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font>${user.Owners[2].OwnerName}</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <span>${user.Owners[3].OwnerName}</span>
                 </td>
               </tr>
               <tr  style="font-family: 'Roboto'; font-size: 0.8em;">
                 <td width="25%" style="text-align:center">
                  <font color="#888">${user.Owners[0].Username}</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#888">${user.Owners[1].Username}</font></font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#888">${user.Owners[2].Username}</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#888">${user.Owners[3].Username}</font>
                 </td>
               </tr>
               <tr height="10px"></tr>
               <tr  style="font-family: 'Roboto'; font-size: 1em;">
                 <td width="25%" style="text-align:center">
                  <font color="#000">${user.Owners[0].TotalPoints} Points</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#000">${user.Owners[1].TotalPoints} Points</font></font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#000">${user.Owners[2].TotalPoints} Points</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#000">${user.Owners[3].TotalPoints} Points</font>
                 </td>
               </tr>
               <tr height="10px"></tr>
            </table>
            <table cellspacing="0" cellpadding="0">
              <tr>
                  <td style="border-radius: 2px;" bgcolor="#EBAB38">
                      <a href="https://www.derby-fwl.com" target="_blank" style="padding: 8px 12px; border: 1px solid #EBAB38;border-radius: 2px;font-family:Roboto;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                          GO TO STANDINGS             
                      </a>
                  </td>
              </tr>
          </table>
            
            <div style="">
              
            </div>
          <p>
            <img src="cid:Derby_Email_sports_icons_2x.png" width="600" height="66">
          </p>
          <p>
            <img src="cid:Derby_Email_footer_newest.png" width="600" height="83">
          </p>
          </div>
        </td>
      </tr>
    </table>
  `)
}
//#249245
//#F80702
module.exports = {subject: forgotpasswordSubject, body: forgotpasswordBody, inline: createInline}
const path = require('path')
const dev = process.env.NODE_ENV !== 'production'
const header = path.join(__dirname, '/Derby_Email_headline_Welcome-to-Derby_2.jpg')
const footer1 = path.join(__dirname, '/Derby_Email_sports_icons_2x.png')
const footer2 = path.join(__dirname, '/Derby_Email_footer_newest.png')
const image1 = path.join(__dirname, '/test1.png')

const forgotpasswordSubject = (user) => `[Derby] Weekly Report`

const createInline = () => [header, footer1, footer2, image1]

const forgotpasswordBody = (user) => {
  const HOST = dev ? 'http://localhost:3000' : 'http://www.derby-fwl.com'
  const LINK = `${HOST}/createpassword`
  return (`
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <img src="cid:Derby_Email_headline_Welcome-to-Derby_2.jpg" width="600" height="181">
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
                <img src="cid:test1.png" width="100" height="100">
                 </td>
                 <td width="25%" style="text-align:center">
                <img src="cid:test1.png" width="100" height="100">
                 </td>
                 <td width="25%" style="text-align:center">
                <img src="cid:test1.png" width="100" height="100">
                 </td>
                 <td width="25%" style="text-align:center">
                <img src="cid:test1.png" width="100" height="100">
                 </td>
               </tr>
               <tr height="10px">
               </tr>
               <tr  style="font-family: 'Roboto'; font-size: 1.0em;">
                 <td width="25%" style="text-align:center">
                  <span>Team Name 1</span>
                 </td>
                 <td width="25%" style="text-align:center">
                  <span>Team Name 2</span>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font>Team Name 3</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <span>Team Name 4</span>
                 </td>
               </tr>
               <tr  style="font-family: 'Roboto'; font-size: 0.8em;">
                 <td width="25%" style="text-align:center">
                  <font color="#888">Owner 1</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#888">Owner 2</font></font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#888">Owner 3</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#888">Owner 4</font>
                 </td>
               </tr>
               <tr height="10px"></tr>
               <tr  style="font-family: 'Roboto'; font-size: 1em;">
                 <td width="25%" style="text-align:center">
                  <font color="#249245">+1 position</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#F80702">-1 position</font></font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#000">No Change</font>
                 </td>
                 <td width="25%" style="text-align:center">
                  <font color="#000">No Change</font>
                 </td>
               </tr>
               <tr height="10px"></tr>
            </table>
            <table cellspacing="0" cellpadding="0">
              <tr>
                  <td style="border-radius: 2px;" bgcolor="#EBAB38">
                      <a href="https://www.derbyfwl.com" target="_blank" style="padding: 8px 12px; border: 1px solid #EBAB38;border-radius: 2px;font-family:Roboto;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
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

module.exports = {subject: forgotpasswordSubject, body: forgotpasswordBody, inline: createInline}
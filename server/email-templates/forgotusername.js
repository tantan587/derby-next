const path = require('path')
const header = path.join(__dirname, '/Derby_Email_headline_Welcome-to-Derby_2.jpg')
const footer1 = path.join(__dirname, '/Derby_Email_sports_icons_2x.png')
const footer2 = path.join(__dirname, '/Derby_Email_footer_text_2x.png')

const forgotusernameSubject = (user) => `[Derby] Forgot Username`

const forgotusernameBody = (user) => `
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <img src="cid:Derby_Email_headline_Welcome-to-Derby_2.jpg" width="600" height="181">
        <div style="width: 600px; font-family: 'Roboto'; font-size: 1.2em; margin: 30px; color: 'black';">
          <p style="text-align: left;">Dear ${user.first_name},</p>
          <p style="text-align: left;">Your username is: <b>${user.username}</b></p>
          <p style="text-align: left;">Have fun and good luck!</p>
          <p style="text-align: left;">derby-fwl.com Fantasy Staff</p>
        </div>
        <p>
          <img src="cid:Derby_Email_sports_icons_2x.png" width="600" height="66">
        </p>
        <p>
          <img src="cid:Derby_Email_footer_text_2x.png" width="600" height="50">
        </p>
      </td>
    </tr>
  </table>
`

module.exports = {subject: forgotusernameSubject, body: forgotusernameBody, inline: [header, footer1, footer2]}
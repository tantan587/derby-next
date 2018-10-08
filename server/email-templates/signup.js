const path = require('path')
const dev = process.env.NODE_ENV !== 'production'
const header = path.join(__dirname, '/Derby_Email_headline_Welcome-to-Derby_2.jpg')
const footer1 = path.join(__dirname, '/Derby_Email_sports_icons_2x.png')
const footer2 = path.join(__dirname, '/Derby_Email_footer_newest.png')

const signupSubject = (user) => `[Derby] Email Verification`

const signupBody = (user) => {
  const HOST = dev ? 'http://localhost:3000' : 'http://www.derby-fwl.com'
  const LINK = `${HOST}/email-verification?i=${user.user_id}&c=${user.verification_code}`
  return (`
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <img src="cid:Derby_Email_headline_Welcome-to-Derby_2.jpg" width="600" height="181">
          <div style="width: 600px; font-family: 'Roboto'; font-size: 1.2em; margin: 30px; color: 'black';">
            <h3 style="text-align: left;">Welcome to Derby, ${user.first_name}!</h3>
            <p style="text-align: left;">Here's your verification code: <b>${user.verification_code}</b></p>
            <p style="text-align: left;">
              Or you can also click here: <br />
              <a href="${LINK}">${LINK}</a>
            </p>
          </div>
          <p>
            <img src="cid:Derby_Email_sports_icons_2x.png" width="600" height="66">
          </p>
          <p>
            <img src="cid:Derby_Email_footer_newest.png" width="600" height="83">
          </p>
        </td>
      </tr>
    </table>
  `)
}

module.exports = {subject: signupSubject, body: signupBody, inline: [header, footer1, footer2]}
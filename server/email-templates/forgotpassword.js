const path = require('path')
const dev = process.env.NODE_ENV !== 'production'
const header = path.join(__dirname, '/Derby_Email_headline_Welcome-to-Derby_2.jpg')
const footer1 = path.join(__dirname, '/Derby_Email_sports_icons_2x.png')
const footer2 = path.join(__dirname, '/Derby_Email_footer_newest.png')

const forgotpasswordSubject = (user) => `[Derby] Forgot Password`

const forgotpasswordBody = (user) => {
  const HOST = dev ? 'http://localhost:3000' : 'http://www.derby-fwl.com'
  const LINK = `${HOST}/createpassword`
  return (`
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <img src="cid:Derby_Email_headline_Welcome-to-Derby_2.jpg" width="600" height="181">
          <div style="width: 600px; font-family: 'Roboto'; font-size: 1.2em; margin: 30px; color: 'black';">
            <p style="text-align: left;">Dear ${user.first_name},</p>
            <p style="text-align: left;">You have requested to reset your password.</p>
            <p style="text-align: left;">Your temporary password is: <b>${user.password}</b></p>
            <p style="text-align: left;">To change your password, please follow these steps:</p>
            <ol style="text-align: left;">
              <li>Go to this <a href="${LINK}">LINK</a></li>
              <li>Enter your username</li>
              <li>Enter your temporary password. Hint: Copy and paste the password in order to enter it</li>
              <li>Create your new password</li>
              <li>Hit the SUBMIT button</li>
            </ol>
            <p style="text-align: left;">Enjoy the derby!</p>
            <p style="text-align: left;">derby-fwl.com Fantasy Staff</p>
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

module.exports = {subject: forgotpasswordSubject, body: forgotpasswordBody, inline: [header, footer1, footer2]}
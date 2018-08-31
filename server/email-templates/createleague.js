const path = require('path')
const dev = process.env.NODE_ENV !== 'production'
const header = path.join(__dirname, '/Derby_Email_headline_A-New-Way-to-Play_2.jpg')
const footer1 = path.join(__dirname, '/Derby_Email_sports_icons_2x.png')
const footer2 = path.join(__dirname, '/Derby_Email_footer_text_2x.png')

const createLeagueSubject = (user) => `You've Created a League!`

const createLeagueBody = (user) => {
  const HOST = dev ? 'http://localhost:3000' : 'http://www.derby-fwl.com'
  return (`
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <img src="cid:Derby_Email_headline_A-New-Way-to-Play_2.jpg" width="600" height="181">
          <div style="width: 600px; font-family: 'Roboto'; font-size: 1.2em; margin: 30px; color: 'black';">
            <h3 style="text-align: left;">Dear ${user.first_name}!</h3>
            <p style="text-align: left;">You've just created a Derby Fantasy Wins League</p>
            <p style="text-align: left;">Now's your chance to get the race started by inviting others to join your league.</p>
            <p style="text-align: left;">You can invite others to sign up on <a href="https://www.derby-fwl.com">Derby FWL</a>
            using your league name and password below: </p>
            <p style="text-align: left;">
              League Name: <b>${user.league_name}</b><br />
              Password: <br>${user.league_password}</b>
            </p>
            <p style="text-align: left;">You can also change your league settings, draft time, and invite managers on Derby Fantasy Wins League from our home page.</p>
            <p style="text-align: left;">As a reminder, your league is currently set to draft on ${user.draft_day} at ${user.draft_time}.</p>
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
  `)
}

module.exports = {subject: createLeagueSubject, body: createLeagueBody, inline: [header, footer1, footer2]}
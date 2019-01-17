const R = require('ramda')
const path = require('path')
const dev = process.env.NODE_ENV !== 'production'
const header = path.join(__dirname, '/Derby_Email_headline_Welcome-to-Derby_2.jpg')
const footer1 = path.join(__dirname, '/Derby_Email_sports_icons_2x.png')
const footer2 = path.join(__dirname, '/Derby_Email_footer_text_2x.png')

const leagueInviteSubject = ({league}) => `[Derby] League Invitation: "${league.league_name}"`

const leagueInviteBody = ({user, league}) => {
  const HOST = dev ? 'http://localhost:3000' : 'http://www.derby-fwl.com'
  const LINK = `${HOST}/joinleague?code=${Buffer.from(JSON.stringify({
    league_name: league.league_name,
    league_password: league.league_password,
    user_id: user.user_id,
  })).toString('base64')}`

  return (`
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <img src="cid:Derby_Email_headline_Welcome-to-Derby_2.jpg" width="600" height="181">
          <div style="width: 600px; font-family: 'Roboto'; font-size: 1.2em; margin: 30px; color: 'black';">
            <h3 style="text-align: left;">Hello, ${user.first_name}!</h3>
            <p style="text-align: left;">You have been invited to <b>${league.league_name}</b></p>
            <p style="text-align: left;">
              You can click here to join: <br />
              <a href="${LINK}">${LINK}</a>
            </p>
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

const leagueInviteSubjectv2 = (invite) => `[Derby] League Invitation: "${invite.league_name}"`

const leagueInviteBodyv2 = (invite) => {
  const HOST = dev ? 'http://localhost:3000' : 'http://www.derby-fwl.com'
  const LINK = `${HOST}/joinleague?code=${Buffer.from(JSON.stringify({
    league_name: invite.league_name,
    league_password: invite.league_password,
    user_id: invite.user_id,
  })).toString('base64')}`

  return (`
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <img src="cid:Derby_Email_headline_Welcome-to-Derby_2.jpg" width="600" height="181">
          <div style="width: 600px; font-family: 'Roboto'; font-size: 1.2em; margin: 30px; color: 'black';">
            <h3 style="text-align: left;">Hello, ${invite.first_name}!</h3>
            <p style="text-align: left;">You have been invited to <b>${invite.league_name}</b></p>
            <p style="text-align: left;">
              You can click here to join: <br />
              <a href="${LINK}">${LINK}</a>
            </p>
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

module.exports = {
  to: R.prop('email'),
  subject: leagueInviteSubjectv2,
  body: leagueInviteBodyv2,
  inline: [header, footer1, footer2],
}
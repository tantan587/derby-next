const path = require('path')
const dev = process.env.NODE_ENV !== 'production'
const header = path.join(__dirname, '/Derby_Email_headline_Welcome-to-Derby_2.jpg')
const footer1 = path.join(__dirname, '/Derby_Email_sports_icons_2x.png')
const footer2 = path.join(__dirname, '/Derby_Email_footer_newest.png')

const leagueInviteSubject = (user) => `[Derby] League Invitation`

const createInline = () => [header, footer1, footer2]

const leagueInviteBody = (user) => {
  const HOST = dev ? 'http://localhost:3000' : 'http://www.derby-fwl.com'
  const LINK = `${HOST}/email-verification?i=${user.user_id}&c=${user.verification_code}`
  return (`
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <img src="cid:Derby_Email_headline_Welcome-to-Derby_2.jpg" width="600" height="181">
          <div style="width: 600px; font-family: 'Roboto'; font-size: 1.2em; margin: 30px; color: 'black';">
            <h3 style="text-align: left;">Dear ${user.first_name}!</h3>
            <p style="text-align: left;">Welcome to Derby Fantasy Wins League! ${user.league_commissioner} has invited you to join the race!</p>
            <p style="text-align: left;">If you have already created an account on our site, please click <a href="${LINK}">HERE</a> to join the following league:
            <br />
            Name: ${user.league_name}
            <br />
            Password: ${user.league_password}
            </p>
            <p style="text-align: left;">If you have not yet created an account, you can <a href = "https://www.derby-fwl.com/signup">sign up here</a>.
            After you create and verify your account, you can join your league either by clicking the link above or by visiting the <a href="https://www.derby-fwl.com/joinleague">Join League</a> page on our Web site</p>
            <p style="text-align: left;">Your league’s draft date and time is currently set for ${user.time} on ${user.date}. Your league commissioner can modify the time if necessary.</p>
            <p style="text-align: left;">New to Derby? Derby Fantasy Wins League is a new way to play fantasy sports: you select teams across many sports and earn points when they win games.
             Every regular season and playoff game counts, with point bonuses for playoff achievements. After your draft, there’s absolutely no work: all you have to do is watch your teams win and your point totals grow!</p>
            <p style="text-align: left;">For the best experience, we strongly recommend that you draft your roster on a computer rather than a mobile device.</p>
            <p style="text-align: left;">For more information, check out our Web site at <a href="https://www.derby-fwl.com">www.derby-fwl.com</a>. We encourage you to review the <a href="https://www.derby-fwl.com/rules">official rules</a> 
            for drafts and scoring and to check out some <a href="https://www.derby-fwl.com/faq">frequently asked questions</a>. 
            Once you have registered for your league, you may also preview your Draft Room  to view teams’ rankings, learn about the different features of the draft, and set your draft queue.</p>
            <p style="text-align: left;">Thank you for playing! We hope you enjoy the race!</p>
            <p style="text-align: left;">Sincerely, </ br>
            Derby Fantasy Wins League</p>

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

module.exports = {subject: leagueInviteSubject, body: leagueInviteBody, inline: createInline}
import styles, { Indent, UL, SubUL, H2, H3, B, Top } from './style'
import { withStyles } from '@material-ui/core/styles'

const RulesPage = withStyles(theme => ({
  container: {
    width: '80%',
    [theme.breakpoints.down('sm')]: { width: '90% '},
    [theme.breakpoints.down('xs')]: { width: '95% '},
  }
}))(({ classes }) =>
  <div style={styles.layout}>
    <div className={classes.container}>
      <div style={styles.H1}>GAME RULES</div>

      <div style={styles.P}>Derby Fantasy Wins League is a fantasy game in which players draft teams across multiple sports, accruing points as each of their teams wins games and achieves other team-based performance bonuses.</div>
      <div style={styles.H2}>FORMAT AND SCORING RULES</div>

      <div style={styles.P}><span style={{ fontWeight: 600 }}>1. Roster Breakdown.</span> Each player will have 15 teams on their roster. The roster breakdown is as follows:</div>
      <Top />
      <Indent><div style={styles.H3}>&bull; NFL: Two teams, one AFC and one NFC</div></Indent>
      <Indent><div style={styles.H3}>&bull; NBA: Two teams, one Eastern Conference and one Western Conference</div></Indent>
      <Indent><div style={styles.H3}>&bull; NHL: Two teams, one Eastern Conference and one Western Conference</div></Indent>
      <Indent><div style={styles.H3}>&bull; MLB: Two teams, one American League and one National League</div></Indent>
      <Indent><div style={styles.H3}>&bull; Premier League Soccer*: One team</div></Indent>
      <Indent><div style={styles.H3}>&bull; NCAA Football: Three teams, selected from the ACC, Big Ten, Big 12, Pac-12, SEC and Independents; maximum of one team per conference</div></Indent>
      <Indent><div style={styles.H3}>&bull; NCAA Men’s Basketball: Three teams, selected from the American (AAC), ACC, Big East, Big Ten, Big 12, Pac-12 and SEC; maximum of one team per conference</div></Indent>
      <Top />
      <div style={styles.P}>* Derby league commissioners can opt to toggle off Premier League soccer if they choose. If Premier League soccer is toggled off in a given Derby league, there will be 14 teams drafted, and all other rules remain the same.</div>
      <Top />
      <div style={styles.P}><span style={{ fontWeight: 600 }}>2. Win Points.</span> Points are awarded each time a team wins games. Point values are assigned proportionately to the number of total games in each sport’s season, adjusted for performance benchmarks in each sport. All points are additive and cumulative. The points breakdown is as follows:</div>
      <Top />
      <Indent><div style={styles.H3}>NFL</div>
        <H3>
          <UL>Regular Season Win: 15 points</UL>
          <UL>Playoff Game Win: 15 points</UL>
          <UL>Bye in playoffs (i.e., top two division winners in each AFC and NFC): 15 points</UL>
        </H3>
      </Indent>
      <Top />
      <Indent><H3>
        NBA

        <UL>Regular Season Win: 3 points</UL>
        <UL>Playoff Win: 3 points</UL>
      </H3></Indent>
      <Top />
      <Indent><H3>
        MLB

        <UL>Regular Season Win: 2 points</UL>
        <UL>Playoff Win: 5 points</UL>
        <UL>Playoff Bye (i.e. winning regular season division title): 5 points</UL>
        <UL>Milestone bonus: Reach 85 wins: +25 points</UL>
      </H3></Indent>
      <Top />
      <Indent><H3>
        NHL

        <UL>Regular Season Wins: 3 points</UL>
        <UL>Regular Season Overtime Loss: 1.5 points</UL>
        <UL>Playoff Win: 3 points</UL>
        <UL>Milestone: Reach 100 standings points: +25 points</UL>
      </H3></Indent>
      <Top />
      <Indent><H3>
        Premier League

        <UL>Regular Season Wins: 6 points</UL>
        <UL>Regular Season Draws: 2 points</UL>

        <UL>Top four teams earn a Playoff Qualification.</UL>
        <UL>Top two teams earn a Championship Round Appearance.</UL>
        <UL>Top team earns a Title Win.</UL>
      </H3></Indent>
      <Top />
      <Indent><H3>
      NCAA Football

        <UL>Regular Season Win: 18 points</UL>
        <UL>Conference Championship Game Win: 18 points</UL>
        <UL>Bowl Game Win: 18 points</UL>
        <UL>Playoff Win: 25 points</UL>

        <UL>New Year’s Six appearances count as a Playoff Qualification. These games are the Rose Bowl, Fiesta Bowl, Orange Bowl, Sugar Bowl, Cotton Bowl, and Peach Bowl.</UL>
        <UL>College Football Playoff berths count as a Championship Round Appearance.</UL>
        <UL>College Football Playoff semifinals and finals wins count as Playoff Wins.</UL>
        <UL>College Football Playoff finals win also entitles the victorious team to a Title Win, in addition to the Playoff Win bonus.</UL>
      </H3></Indent>
      <Top />
      <Indent><H3>
      NCAA Men’s Basketball

        <UL>Regular Season Win: 7 points</UL>
        <UL>Conference Tournament Win: 7 points</UL>
        <UL>NCAA Tournament (Playoff) Win: 7 points</UL>
        <UL>NCAA Tournament Bye: 7 points</UL>

        <UL>Conference tournament byes do not count for Derby points.</UL>
        <UL>NCAA Tournament berths count as Playoff Qualification.</UL>
        <UL>Final Four berths count as Championship Round Appearance.</UL>
        <UL>Wins in other postseason tournaments do not count for Derby points.</UL>
        <UL>NCAA Tournament Championship Game win entitles the victorious team to a Title Win bonus, in addition to the Playoff Win bonus.</UL>
      </H3></Indent>
      <Top />
      <H3><B>3. One-Time Bonus Points.</B> In addition to Win Points set forth in Section 2, one-time bonus points will be awarded as follows:

        <UL><B>Playoff Qualification:</B> 20 points</UL>
        <UL><B>Championship Round Appearance:</B> 20 points</UL>
        <UL><B>Title Win:</B> 20 points</UL>
        <Top />
All points are additive and cumulative. Though Playoff Qualifications and Championship Round Appearances earn bonus points, other playoff advancements (e.g., quarterfinals and semifinals appearances) do not earn bonus points. (They do, however, entitle teams to the potential of earning more playoff wins, Championship Round Appearances and Title Wins.)
        <div style={{margin: '1em 0'}} />
Playoff Qualification bonus points are awarded at the conclusion of the given sport’s regular season. Championship Round Appearance bonus points are awarded when the affected team earns its berth in that round. Title Win bonus points are awarded when the winning team wins the title in its sport.

        <Top />
        <B>4. Additional Considerations.</B>

        <UL>Wins in a title game for any sport count as both a Playoff Win and a Title Win bonus.</UL>
        <UL>Play-in games for any sport (e.g., Game 163 in MLB to determine a division or Wild Card winner) do not count for Derby points.</UL>
        <UL>The NHL and Premier League use a point system rather than winning percentage and record to rank teams. Derby point values correspond to each sport’s system.</UL>
        <Indent><SubUL>Since NHL overtime losses are worth one half of a regular season win, Derby points for overtime losses are worth one half of a regular season win.</SubUL></Indent>
        <Indent><SubUL>Since Premier League draws are worth one third of a regular season win, Derby points for draws are worth one third of a regular season win.</SubUL></Indent>

        <Top />
        <B>5. Season Cycle.</B> The Derby season lasts for one complete cycle of each sport’s season. For example, in a Derby draft in August 2018, the following schedule, in chronological order would apply:

        <UL>2018-19 EPL</UL>
        <UL>2018 NCAA Football (including 2019 College Football Playoff)</UL>
        <UL>2018 NFL (incl. 2019 Playoffs and Super Bowl)</UL>
        <UL>2018-19 NHL</UL>
        <UL>2018-19 NBA</UL>
        <UL>2018-19 NCAA Men’s Basketball</UL>
        <UL>2019 MLB</UL>

        <Top />
        Accordingly, this season will begin at the outset of the 2018-19 EPL season and conclude with the 2019 World Series.

        <Top />
        <B>6. League Composition.</B> Derby leagues must contain a minimum of 8 rosters and a maximum of 15 rosters. If a league member deletes his or her account during the course of a Derby season, the season will continue as if points accrued by that player still counted towards that player’s total, though that player will not be eligible to win his or her league without a valid and active account.

        <Top />
        <B>7. No Daily Management.</B> All teams drafted remain “active” for the entirety of the Derby season and accrue points when they win games. Teams are never “benched,” i.e., not counted for any individual game.

        <Top />
        <B>8. How to Win; Tiebreakers.</B> The Derby player with the most amount of win points at the end of a full season cycle wins his or her league. In the event of a tie, the tiebreaker procedure is as follows:

        <Indent>a. The player with the most Title Wins, irrespective of points, wins</Indent>
        <Indent>b. If there is still a tie, the player with the most Championship Round Appearances wins</Indent>
        <Indent>c. If there is still a tie, the player with the most Playoff Qualifications wins</Indent>
        <Indent>d. If there is still a tie, the player with the most single-game wins, irrespective of points, wins</Indent>
        <Indent>e. If there is still a tie, go outside and run a 40-yard dash. Exercise is good. But don’t blame us if you pull a hamstring.</Indent>
      </H3>
      <H2>DRAFT RULES</H2>
      <H3>
        <Top />
        <B>1. Time of Draft.</B> Each Derby league commissioner will set the date and time of the league’s draft. 
        Drafts must be conducted through the Derby Web site offered at www.derby-fwl.com; we do not currently 
        offer an offline draft option. All roster owners must be registered with an active Derby account 
        and signed up for the particular league at least eight (8) hours prior to the set draft time
        <Top />
        <B>2. No Order of Picks by Sport.</B> Teams from each sport may be selected in any order. 
        Derby players determine when to select teams from each sport.
        <Top />
        <B>3. Snake Format; Modifications.</B> The draft follows a standard snake format, i.e., 
        the player who picks first in one round will pick last in the next round, and vice versa.
         Auction or other draft formats are not currently available teams.
        <Top />
        <B>4. Draft Order.</B> Draft order will be randomly generated by our platform.
        <Top />
        <B>5. Time Limits to Make Picks.</B> Derby players will have 1 minute to make each selection. 
        Players can place teams in their draft queues or select directly from the list of available teams.
        <Top />
        <B>6. Pre-Setting Draft Queues.</B> Individual players may pre-set draft queues with sufficient
         options to fill out all slots on their draft boards.
        <Top />
        <B>7. Expiration of Time to Pick with Queue Set.</B> If a player runs out of time before making 
        his or her next pick, the team listed highest on his or her queue will be the default pick.
        <Top />
        <B>8. Expiration of Time to Pick without Queue Set.</B> If a player runs out of time and
         does not have an eligible team listed in his or her queue, then any affected picks will 
         be made automatically. The automatic pick will be based on the highest ranked 
         team available and eligible for the player’s roster, according to the official Derby season projections.
        <Top />
        <B>9. Player Offline at Time of Pick.</B> If a player is not present in the draft 
        room at the time his or her draft selection comes, the pick will be made according
         to the player’s queue as set forth in Rule 7 above. If the player does not 
         have a set queue with any eligible picks, the pick will be made at the expiration of 
         five (5) seconds of the affected player’s time. At their own discretion,
          Commissioners may pause the draft during this five-second period in order to
           prevent automatic picks from occurring for a player who is offline.
        <Top />
        <B>10. Picks are Final; Pausing by Commissioner.</B> All picks are final and 
        irreversible during the draft. Drafts can be paused by the Commissioner only. 
        Upon the conclusion of the draft, Commissioners may revise picks at their own discretion.
        <Top />
        <B>11. Draft Time Changes.</B> Draft dates and times can be updated as many times as is 
        necessary up to three (3) hours prior to the set draft time. 
        Commissioners can undertake these functions by visiting the Commish Tools page.
      </H3>
      <H2>League Rules</H2>
      <H3>
        <Top />
        <B>1. Rosters are Set.</B> Rosters, once drafted, are final. Teams may not be traded, waived or dropped.
        <Top />
        <B>2. All Teams Active.</B> All teams are active for every game. No “bench” feature exists.
        <Top />
        <B>3. Points-Based Scoring.</B> Scoring is “points-only” style; all Derby league members compete against each other throughout the entire season.
        <Top />
        <B>4. Score Updates.</B> Derby scores are updated at the conclusion of each game. Scores are subject to any changes promulgated by the governing body of each sport (e.g., NFL, NCAA)
        <Top />
        <B>5. Private Leagues; Renewal of Leagues.</B> Derby leagues are all private and renewed. Each League will have a commissioner who invites new players to the league and administers functions throughout the season. Leagues are automatically renewed, though commissioners can choose to alter the number of rosters and the members of each league with each new cycle, so long as the overall number of rosters remains between 8 and 15.
      </H3>
    </div>
    <br/>
    <br/>
  </div>
)

export default RulesPage

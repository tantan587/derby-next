import styles, { Indent, UL, H3, Top } from './style'
import { withStyles } from '@material-ui/core/styles'

const FAQPage = withStyles(theme => ({
  container: {
    width: '80%',
    [theme.breakpoints.down('sm')]: { width: '90% '},
    [theme.breakpoints.down('xs')]: { width: '95% '},
  }
}))(({ classes }) =>
  <div style={styles.layout}>
    <div className={classes.container}>
      <div style={styles.H1}>FREQUENTLY ASKED QUESTIONS</div>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>What are we doing here?</span> 
        <br/>
        <br/>
        <div>Derby Fantasy Wins League is brand a new fantasy sports game: the multi-sport fantasy wins league, where participants earn points for team wins instead of individual player statistics.</div>
      </div>
      <br/>
      <br/>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>How does the game work?</span> 
        <br/>
        <br/>
        <div> Derby players create or join leagues with their friends and compete in a once-a-year draft. In the draft, players pick rosters made up of teams from the NFL, MLB, NBA, NHL, NCAA football and men’s basketball, and English Premier League (EPL) soccer. Teams on each player’s roster accrue points as they win games, and they achieve bonuses for playoff qualifications, championship round appearances and title wins. Some sports include a milestone bonus for teams that reach a certain number of wins in a season. After a full rotation of seasons across these sports, the player with the most points in each Derby league wins the race.</div>
      </div>
      <br/>
      <br/>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>How much work is this to keep track of?</span> 
        <br/>
        <br/>
        <div>After the draft, all you have to do is watch your teams win games, including playoff games, and earn points all year long. All fantasy players know what a burden roster management can be: setting lineups, monitoring injuries and weather, tracking waivers, and handling all the other mundane demands of a fantasy team. In Derby, there’s no work whatsoever: watch games all seasons long, earn points, and try to win the race. Derby keeps running during the playoffs, too.</div>
      </div>
      <br/>
      <br/>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>Why should I play this type of format?</span>
        <br/>
        <br/>
        <div>Imagine all the fun of both live and fantasy sports: cheering for something larger than one’s self, reveling in the games, and competing for bragging rights – with none of the work. Fantasy devotees can devise their ideal strategies for picking the best teams, while casual fans looking to have fun watching sports without subjecting themselves to arduous responsibilities can play right alongside.</div>
      </div>
      <br/>
      <br/>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>How many people need to be in a league?</span> 
        <br/>
        <br/>
        <div>Derby leagues can include anywhere from 8-15 individual players. One player, the commissioner, can create a league on our site and then invite friends, family, coworkers or anyone else they know to join the league.</div>
      </div>
      <br/>
      <br/>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>What kind of draft are we talking about?</span> 
        <br/>
        <br/>
        <div>Drafts follow a standard snake order. Derby rosters comprise selections from the following sports:</div>
      </div>
      
      <Top />
      <Indent><div style={styles.H3}>&bull; NFL: 1 AFC team, 1 NFC team</div></Indent>
      <Indent><div style={styles.H3}>&bull; MLB: 1 American League team, 1 National League team</div></Indent>
      <Indent><div style={styles.H3}>&bull; NBA: 1 Eastern Conference team, 1 Western Conference team</div></Indent>
      <Indent><div style={styles.H3}>&bull; NHL: 1 Eastern Conference team, 1 Western Conference team</div></Indent>
      <Indent><div style={styles.H3}>&bull; EPL: 1 team</div></Indent>
      <Indent><div style={styles.H3}>&bull; NCAA Football: 3 teams, selected from the ACC, Big Ten, Big 12, Pac-12, SEC and Independents; max 1 team per conference</div></Indent>
      <Indent><div style={styles.H3}>&bull; NCAA Basketball: 3 teams, selected from the American, ACC, Big East, Big Ten, Big 12, Pac-12, SEC; max 1 team per conference</div></Indent>
      
      <br/>
      <br/>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>Do I have to pick teams from sports in any particular order?</span>
        <br/>
        <br/>
        <div> Not at all. Players can pick teams from each sport in any order they wish. As a result, every Derby draft is unique, as each one will reflect the priorities, prognostications and preferences of the players in that specific Derby league.</div>
      </div>
      <br/>
      <br/>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>How long does a Derby season last?</span> <br/>
        <br/>
        <div>Derby cycles last for the full duration of one of each season in the game. As a result, a full cycle is typically around 15 months. For example, a Derby cycle beginning in August with the EPL, NCAA Football and the NFL seasons will end at the conclusion of the following season’s MLB World Series.</div>
      </div>
      <br/>
      <br/>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>Do I have to monitor lineups, check waivers or keep an eye on weather or injuries?</span><br/>
        <br/>
        <div> Nope! Once players draft their teams, rosters are set. Points are awarded for wins in all regular season and playoff games, and bonuses are awarded for playoff qualifications, championship round appearances and title wins. We have designed the scoring system to account for variations in both the number of games in each sport’s season as well as a reasonable expectation of how teams may perform in that sport. In other words, there’s no advantage in drafting teams in one sport before any other sport. You can instead focus on picking the teams they think will win the most games, and then enjoy having a strong rooting interest in their teams all year long.</div>
      </div>
      <br/>
      <br/>
      <div style={styles.P}><span style={{ fontWeight: 600 }}>How does scoring work?</span> <br/>
        <br/>
        <div>The different sports in a Derby league have a wide range of games and expected wins. As a result, wins in one sport can’t be equal to wins in another sport simply by assigning each win one point value. It is difficult to equate the value of a win in different sports. For example, MLB teams play 162 games in a season, and going undefeated (or anything close to it) is impossible. College football teams, on the other hand, play as few as 12 games in a season, and almost every year at least one team wins every game. After lots of tinkering in our super-secret scoring lab, we’ve created a scoring system that provides no advantage to any individual sport. All you have to do is pick the best teams! Here’s how points are awarded:</div>
      </div>
      <Top />
      <Indent><div style={styles.H3}>NFL</div>
        <H3>
          <UL>Regular Season Win: 15 points</UL>
          <UL>Playoff Game Win: 15 points</UL>
          <UL>Bye in playoffs (i.e., top two division winners in each AFC and NFC): 15 points</UL>
        </H3>
      </Indent>
      <Top />
      <Indent>
        <H3>
          NBA
          <UL>Regular Season Win: 3 points</UL>
          <UL>Playoff Win: 3 points</UL>
        </H3>
      </Indent>
      <Top />
      <Indent>
        <H3>
      MLB
          <UL>Regular Season Win: 2 points</UL>
          <UL>Playoff Win: 5 points</UL>
          <UL>Playoff Bye (i.e. winning regular season division title): 5 points</UL>
          <UL>Milestone bonus: Reach 85 wins: +25 points</UL>
        </H3>
      </Indent>
      <Top />
      <Indent
      ><H3>
      NHL
          <UL>Regular Season Wins: 3 points</UL>
          <UL>Regular Season Overtime Loss: 1.5 points</UL>
          <UL>Playoff Win: 3 points</UL>
          <UL>Milestone: Reach 100 standings points: +25 points</UL>
        </H3></Indent>
      <Top />
      <Indent><H3>
      English Premier League
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
      <Indent><H3>One-Time Bonus Points
        <UL>Playoff Qualification: 20 points</UL>
        <UL>Championship Round Appearance:20 points</UL>
        <UL>Title Win: 20 points</UL>
      </H3></Indent>
      <Top />
      <H3>All points are additive and cumulative.</H3> 
      <Top />
      <div style={styles.P}><span style={{ fontWeight: 600 }}>For the full explanation of game rules and scoring formats, please visit the Official Derby Game Rules</span></div>
    </div>
    <br/>
    <br/>
  </div>
)

export default FAQPage

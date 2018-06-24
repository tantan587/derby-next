import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import '../styles/style.css'
import initStore from '../common/store'
import TopNavHome from '../common/components/Navigation/TopNavHome'
import SportIconText from '../common/components/Icons/SportIconText'
import HowToPlayIconText from '../common/components/Icons/HowToPlayIconText'
import TitleCopyButton from '../common/components/CopyFields/TitleCopyButton'
import HomeTitle from '../common/components/CopyFields/HomeTitle'
import BottomNav from '../common/components/Navigation/BottomNav'
import HomePageTable from '../common/components/Table/HomePageTable'
import SportsSocket from '../common/components/Sockets/SportsSocket'


//https://github.com/zeit/next.js/tree/master/examples/with-global-stylesheet



const styles = {
  section1: {
    textAlign: 'center',
    paddingTop: 100,
    //backgroundColor:'#48311A',
    color:'white',
    backgroundImage: 'url("/static/images/derbyhome2.svg")',
    backgroundRepeat: 'no-repeat',
    //backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: '600px',
    //fontFamily:'Tinos'
  },
  section2: {
    textAlign: 'center',
    paddingTop: 50,
    backgroundColor:'#229246',
    color:'white'},
  section3: {
    paddingTop: 50,
    display: 'flex',
    justifyContent: 'center',
    margin: '40px 15% 40px',
    textAlign: 'center'},
  section4: {
    textAlign: 'center',
    paddingTop: 50,
    color:'#229246'}
}


class Index extends React.Component {
  render() {
    const {classes} = this.props
    const sports = [
      {name:'NFL', src:'/static/icons/SportIcons/sport_icon_football.svg'},
      {name:'NCAA', src:'/static/icons/SportIcons/sport_icon_basketball.svg'},
      {name:'MLB', src:'/static/icons/SportIcons/sport_icon_baseball.svg'},
      {name:'NHL', src:'/static/icons/SportIcons/sport_icon_hockey.svg'},
      {name:'EPL', src:'/static/icons/SportIcons/sport_icon_soccer.svg'},
      {name:'NCAAM', src:'/static/icons/SportIcons/sport_icon_ncaa_basketball.svg'},
      {name:'NCAAM', src:'/static/icons/SportIcons/sport_icon_ncaa_football.svg'}
    ]

    const howToPlay = [
      {name:'1) Create Your Free Account', src:'/static/icons/HowToPlayIcons/CreateAccount.svg', link:'/signup'}, //create account
      {name:'2) Join a League of Friends', src:'/static/icons/HowToPlayIcons/DraftTeam.svg', link:'/participate'}, //particpate form remove protection 
      {name:'3) Draft your Teams', src:'/static/icons/HowToPlayIcons/FormLeague.svg'}, //page of images
      {name:'4) Watch and Win the Race', src:'/static/icons/HowToPlayIcons/WatchWin.svg'} //page of images
    ]

    return (

      <div>
        <TopNavHome/>
        <SportsSocket>
          <div className={classes.section1}>
            <Typography 
              variant="display3" style={{color:'white'}}>
              <div style={{ fontFamily:'museo-slab-bold', display: 'inline'}}>
              A New Way to Play Fantasy Sports
              </div>
              <br/>
              <div style={{fontFamily:'museo-slab', display: 'inline',  width:'80%'}}>
              Cheer for Teams, Not Just Players. All Year Round.
              </div>
            </Typography>
            <br/>
            <Typography variant='headline'style={{color:'white',width:'60%', marginLeft:'20%', lineHeight:1.6}}>
            Pick your teams in this race and ride them to victory! 
            In Derby Fantasy Wins League, compete with your friends
             by drafting teams across multiple sports.
              Earn points when your teams win throughout their entire seasons. 
              The more games your teams win, the more points you earn.
            </Typography>
            <br/>
            <br/>
            {
              sports.map((x,i) => { 
                return <SportIconText key={i} name={x.name} src={x.src}/>})
            }
            <br/>
            <br/>
            <Link href="/signup">
              <Button style={{color:'white', backgroundColor:'#ebab38',height:50, width:125}}>
              
                <div>
                  signup
                </div>
              </Button>
            </Link>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <ExpandMoreIcon style={{color:'white', fontSize: 50}}/>
          </div>
          <div className={classes.section2}>
            <HomeTitle title='Why Derby Is Great' color='white'/>
            <br/>
            <TitleCopyButton 
              title='Play the Way You Watch'
              copy='Play fantasy sports the same way you watch live sports: by rooting for teams to win games and grabbing bragging rights along the way. With Derby, you will always have a team to root for. And, yes, it’s free.'
              buttonText='Create An Account'
              marginRight={20}
              marginLeft={20}
            />
            <TitleCopyButton 
              title='Find Your Unicorn'
              copy='Draft teams across many sports, showing off your strategy skills at both selecting the best odds-on favorites and finding dark horses while your friends get stuck with also-rans.'
              buttonText='More'
              marginRight={20}
              marginLeft={20}
            />
            <TitleCopyButton 
              title=' Breeze Past the Field '
              copy='From post to pole, saddle up and earn points as you watch your teams win. No roster setting or daily waiver scouring. No worrying about injuries or bad weather. And all the games count – even the playoffs. After a full cycle of seasons, whoever has the most points wins the race.'
              buttonText='View Rules'
              marginLeft={20}
            />
            <br/>
            <br/>
            <br/>
          </div>
          <div className={classes.section3}>
            <div style={{ marginRight: -35 }}>
              <img src={'/static/icons/Pennant_Icon.svg'} style={{height:100, width:'auto'}} />
            </div>
            <div style={{ marginRight: 40 }}>
              <HomeTitle title='Root For Teams' color='#229246'/>
              <Typography variant='headline'style={{color:'#229246', lineHeight:1.6, fontWeight:'bold'}}>
              Root for teams, not just players. Win when your teams do!
              </Typography>
            </div>
            <div>
              <img src={'/static/icons/Foam_Finger_Icon.svg'} style={{height:100, width:'auto'}} />
            </div>
          </div>
          <Typography variant='headline'style={{color:'#229246', width:'60%',marginLeft:'20%', marginBottom: 40,lineHeight:1.6, textAlign:'center'}}>
          There’s nothing like being part of a team. How about being a part of 15 of them? In Derby Fantasy Wins League, 
          you will build a bond with two NFL, two NBA, two MLB, two NHL, one EPL, three NCAA Football, 
          and three NCAA Men’s Basketball soccer teams. When they win, you do!
          </Typography>
          <br/>
          <br/>
          <br/>
          <br/>
          <div className={classes.section2}>
            <HomeTitle title='The Derby Difference' color='white'/>
            <br/>
            <br/>
            <div style={{marginLeft:'10%',marginRight:'10%', width:'auto', marginBottom:30}}>
              <HomePageTable/>
            </div>
            <br/>
            <br/>
          </div>
          <div className={classes.section4}>
            <HomeTitle title='How To Play' color='#229246'/>
            <br/>
            {
              howToPlay.map((x,i) => { 
                return <HowToPlayIconText key={i} name={x.name} link={x.link} src={x.src}/>})
            }
            <br/>
          </div>
          <br/>
          <br/>
          <BottomNav/>
          {/* <img src={'/static/icons/racehorse_plain.svg'} alt="none" height={300} width={300}/> */}
        </SportsSocket>
      </div>
      
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRedux(initStore, null, null)(withRoot(withStyles(styles)(Index)))
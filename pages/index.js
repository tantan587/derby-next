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
    textAlign: 'center',
    paddingTop: 50,
    color:'white'},
  section4: {
    textAlign: 'center',
    paddingTop: 50,
    color:'#229246'}
}


class Index extends React.Component {

  render() {
    const {classes} = this.props
    const sports = [
      {name:'NFL', link:'/static/icons/SportIcons/sport_icon_football.svg'},
      {name:'NCAA', link:'/static/icons/SportIcons/sport_icon_ncaa_football.svg'},
      {name:'MLB', link:'/static/icons/SportIcons/sport_icon_baseball.svg'},
      {name:'NBA', link:'/static/icons/SportIcons/sport_icon_basketball.svg'},
      {name:'NCAAM', link:'/static/icons/SportIcons/sport_icon_ncaa_basketball.svg'},
      {name:'NHL', link:'/static/icons/SportIcons/sport_icon_hockey.svg'},
      {name:'EPL', link:'/static/icons/SportIcons/sport_icon_soccer.svg'}
    ]

    const howToPlay = [
      {name:'1. Create Your Free Acount', link:'/static/icons/HowToPlayIcons/CreateAccount.svg'},
      {name:'2. Form a League of Friends', link:'/static/icons/HowToPlayIcons/DraftTeam.svg'},
      {name:'3. Draft your Team', link:'/static/icons/HowToPlayIcons/FormLeague.svg'},
      {name:'4. Watch and Win', link:'/static/icons/HowToPlayIcons/WatchWin.svg'}
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
              <div style={{fontFamily:'museo-slab', display: 'inline'}}>
              Multi-Sport. Team Points. Playoff Bonuses
              </div>
            </Typography>
            <br/>
            <Typography variant='headline'style={{color:'white',width:'60%', marginLeft:'20%', lineHeight:1.6}}>
              Derby is the first of a new fantasy sports game: the multi-sport fantasy wins league.
              Instead of drafting individual players in a single sport, friends compete by drafting
              entire teams across multiple sports and earn points as the teams win games all the way to
              the championship!
            </Typography>
            <br/>
            <br/>
            {
              sports.map((x,i) => { 
                return <SportIconText key={i} name={x.name} link={x.link}/>})
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
              title='Free To Join'
              copy='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod sed do eiusmod tempor incididunt ut labore etelit, do eiusmod tempor incididunt ut labore et dolore magna aliqua'
              buttonText='Create An Account'
              marginRight={20}
              marginLeft={20}
            />
            <TitleCopyButton 
              title='Unique Draft'
              copy='Unique Draft Instead of drafting a roster players, Derby Leagues draft entire teams from seven different sports. Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod tempor magna aliqua.'
              buttonText='More'
              marginRight={20}
              marginLeft={20}
            />
            <TitleCopyButton 
              title='Simple To Play'
              copy='Simple To Play With Derby, no roster maintenance is needed. Derby is great to play with friends who are casual sports fans or people who don’t have time to manage a team. Just Draft, Watch and Win!'
              buttonText='View Rules'
              marginLeft={20}
            />
            <br/>
            <br/>
            <br/>
          </div>
          <div className={classes.section3}>
            <div  style={{display:'inline-block'}}>
              <img src={'/static/icons/Pennant_Icon.svg'} style={{height:100, width:'auto'}} />
            </div>
            <div style={{display:'inline-block', marginLeft:-250}}>
              <HomeTitle title='Root For Teams' color='#229246'/>
              <Typography variant='headline'style={{color:'#229246', lineHeight:1.6,  width:'60%',marginLeft:'20%', fontWeight:'bold'}}>
              Derby Focuses on Team Performance - Wins and Losses - Rather than Individual Play Performance
              </Typography>
            </div>
            <div  style={{display:'inline-block', marginLeft:-170, marginRight:60}}>
              <img src={'/static/icons/Foam_Finger_Icon.svg'} style={{height:100, width:'auto'}} />
            </div>
            <br/>
            <br/>
            <Typography variant='headline'style={{color:'#229246', width:'60%',marginLeft:'20%',lineHeight:1.6}}>
                (Who doesn't hate losing a fantasy matchup because of the quarterback who chalks up a garbage-time passing yards
                late in the 4th quarter, or the shooting guard chucking up hero-ball 3s when the game is already out of reach?)
            </Typography>
            <br/>
            <br/>
            <br/>
            <br/>
          </div>
          <div className={classes.section2}>
            <HomeTitle title='The Derby Difference' color='white'/>
            <br/>
            <br/>
            <div style={{marginLeft:'10%',marginRight:'10%', width:'auto'}}>
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
                return <HowToPlayIconText key={i} name={x.name} link={x.link}/>})
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
const R = require('ramda')
import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import withRoot from '../common/components/withRoot'
import '../styles/style.css'
import TopNavHome from '../common/components/Navigation/TopNavHome'
import SportIconText from '../common/components/Icons/SportIconText'
import HowToPlayIconText from '../common/components/Icons/HowToPlayIconText'
import TitleCopyButton from '../common/components/CopyFields/TitleCopyButton'
import HomeTitle from '../common/components/CopyFields/HomeTitle'
import BottomNav from '../common/components/Navigation/BottomNav'
import HomePageTable from '../common/components/Table/HomePageTable'
import SportsSocket from '../common/components/Sockets/SportsSocket'
import {clickedAdminUpdates} from '../common/actions/auth-actions'
import sportLeagues from '../data/sportLeagues.json'

import MobileNav from '../common/components/Navigation/MobileNav'

//https://github.com/zeit/next.js/tree/master/examples/with-global-stylesheet



const styles = (theme) =>  ({
  section1: {
    textAlign: 'center',
    paddingTop: 100,
    //backgroundColor:'#48311A',
    color:'white',
    //backgroundColor:'#392007',
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
  section5: {
    textAlign: 'center',
    paddingTop: 50,
    backgroundColor:'#229246',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
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
    color:'#229246'},
})


class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {toggleResetEmail:false, firstClick:false}
  }

  firstClick = () =>
  {
    this.setState({firstClick:true})
    setTimeout(() => { console.log('reset'); this.setState({firstClick:false,toggleResetEmail:false }) }, 5000)
  }

  toggleResetEmail = () =>
  {
    this.setState({toggleResetEmail:true})
    
  }
  

  render() {
    const {classes, user} = this.props
    const howToPlay = [
      {name:'1) Create Your Free Account', src:'/static/icons/HowToPlayIcons/CreateAccount.svg', link:'/signup'}, //create account
      {name:'2) Join a League of Friends', src:'/static/icons/HowToPlayIcons/DraftTeam.svg', link:'/participate'}, //particpate form remove protection 
      {name:'3) Draft your Teams', src:'/static/icons/HowToPlayIcons/FormLeague.svg', link:'/signup'}, //page of images
      {name:'4) Watch and Win the Race', src:'/static/icons/HowToPlayIcons/WatchWin.svg', link:'/signup'} //page of images
    ]
    return (
      <div id="outer-container">
        <MobileNav />
        <TopNavHome/>
        <SportsSocket>
          <div id="page-wrap" className={classes.section1} style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Typography 
              variant="display3" style={{color:'white'}}>
              <div style={{ fontFamily:'museo-slab-bold', marginBottom:20}}>
              A New Way to Play Fantasy Sports
              </div>
              <div style={{fontFamily:'museo-slab', marginBottom:20}}>
              Cheer for Teams, Not for Players. All Year Round.
              </div>
            </Typography>
            <Typography variant='headline'style={{color:'white',width:'60%', lineHeight:1.6,  marginBottom:20}}>
            Pick your teams in this race and ride them to victory! 
            In Derby Fantasy Wins League, compete with your friends
             by drafting teams across multiple sports.
              Earn points when your teams win throughout their entire seasons. 
              The more games your teams win, the more points you earn.
            </Typography>

            {
              <div style={{display:'flex', alignItems:'flex-end', justifyContent:'center', flexWrap:'wrap'}}>
                {R.values(sportLeagues).sort((a,b) => a.order > b.order).map((x,i) => { 
                  return <SportIconText key={i} sportId={x.sport_id} />
                })
                }
              </div>
            }
            <br/>
            <br/>
            {
              !user.loggedIn ? 
                <Link href="/signup">
                  <Button style={{color:'white', backgroundColor:'#ebab38',height:50, width:125}}>
                  
                    <div>
                      sign up
                    </div>
                  </Button>
                </Link>
                : null
            }
            
            <br/>
            <br/>
            <br/>
            <br/>
            <ExpandMoreIcon style={{color:'white', fontSize: 50}}/>
          </div>
          <div className={classes.section2}>
            <HomeTitle title='Why Enter the Derby' color='white'/>
            <br/>
            <TitleCopyButton 
              title='Play Like You Watch'
              copy='Play fantasy sports the same way you watch live sports: by rooting for teams to win games and grabbing bragging rights along the way. Stay on track with our live scoreboard and fantasy scoring updates. With Derby, you will always have a favorite team to root for. And, yes, it’s free.'
              buttonText='Create An Account'
              marginRight={20}
              marginLeft={20}
            />
            <TitleCopyButton 
              title='Find Your Unicorn'
              copy='Real teams are your horses in this race! Draft teams across multiple sports to create your own unique roster. Set the pace by showing off your strategy skills at both selecting the best odds-on favorites and finding dark horses while your friends get stuck in the mud with also-rans.'
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
              <img src={'/static/icons/Pennant_Icon.svg'} style={{height:100, width:'auto'}} onClick={() => this.firstClick()}/>
            </div>
            <div style={{ marginRight: 40 }}>
              <HomeTitle title='Root For Teams' color='#229246'/>
              <Typography variant='headline'style={{color:'#229246', lineHeight:1.6,  fontFamily:'museo-slab-bold'}}>
              Root for teams, not just players. Win when your teams do!
              </Typography>
            </div>
            <div>
              <img src={'/static/icons/Foam_Finger_Icon.svg'} style={{height:100, width:'auto'}} onClick={() => this.toggleResetEmail()} />
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
          <div className={classes.section5}>
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

          {this.state.toggleResetEmail ?
            <Button onClick={() => this.props.clickedAdminUpdates(this.props.user.id)}>Invalidate Email</Button> : <div/>}
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

export default R.compose(
  withRoot,
  withStyles(styles),
  connect(R.pick(['user']), {clickedAdminUpdates})
)(Index)

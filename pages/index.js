import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Link from 'next/link'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
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

//https://github.com/zeit/next.js/tree/master/examples/with-global-stylesheet



const styles = {
  section1: {
    textAlign: 'center',
    paddingTop: 100,
    backgroundColor:'#48311A',
    color:'white',
    //backgroundImage: 'url("/static/images/derbyhome.png")',
    //backgroundRepeat: 'no-repeat',
    //backgroundAttachment: 'fixed',
    //backgroundPosition: 'center',
    //backgroundSize: 'cover',
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
    color:'#229246'}
}


class Index extends React.Component {

  render() {
    const {classes} = this.props
    const sports = [
      {name:'NFL', link:'/static/icons/SportIcons/sport_icon_football.svg'},
      {name:'NCAA', link:'/static/icons/SportIcons/sport_icon_football.svg'},
      {name:'MLB', link:'/static/icons/SportIcons/sport_icon_baseball.svg'},
      {name:'NBA', link:'/static/icons/SportIcons/sport_icon_basketball.svg'},
      {name:'NCAAM', link:'/static/icons/SportIcons/sport_icon_basketball.svg'},
      {name:'NHL', link:'/static/icons/SportIcons/sport_icon_hockey.svg'},
      {name:'EPL', link:'/static/icons/SportIcons/sport_icon_soccer.svg'}
    ]

    const howTopPlay = [
      {name:'1. Create Your Free Acount', link:'/static/icons/HowToPlayIcons/CreateAccount.svg'},
      {name:'2. Form a League of Friends', link:'/static/icons/HowToPlayIcons/DraftTeam.svg'},
      {name:'3. Draft your Team', link:'/static/icons/HowToPlayIcons/FormLeague.svg'},
      {name:'4. Watch and Win', link:'/static/icons/HowToPlayIcons/WatchWin.svg'}
    ]

    return (

      <div>
        <TopNavHome/>
        <div className={classes.section1}>
          <Typography 
            type="display3" style={{color:'white'}}>
            <div style={{ fontFamily:'HorsebackSlab', display: 'inline'}}>
              {'Draft '}
            </div>
            <div style={{fontFamily:'museo-slab', display: 'inline'}}>
            Teams
            </div>
            <br/>
            <div style={{ fontFamily:'HorsebackSlab', display: 'inline'}}>
              {'Watch '}
            </div>
            <div style={{fontFamily:'museo-slab', display: 'inline'}}>
            Sports
            </div>
            <br/>
            <div style={{ fontFamily:'HorsebackSlab', display: 'inline'}}>
              {'Win '}
            </div>
            <div style={{fontFamily:'museo-slab', display: 'inline'}}>
            The Race
            </div>
          </Typography>
          <Typography type='headline'style={{color:'white',width:'60%', marginLeft:'20%'}}>
            Derby Fantasy Wins League is a new way to 
            play fantasy sports. Instead of drafting players,
            friends compete by drafting entire teams from multiple sports.
          </Typography>
          <br/>
          {
            sports.map((x,i) => { 
              return <SportIconText key={i} name={x.name} link={x.link}/>})
          }
          <br/>
          <br/>
          <Button style={{color:'white', backgroundColor:'#ebab38',height:50, width:125}}>
            <Link href="/signup">
              <div>
                signup
              </div>
            </Link>
          </Button>
          <br/>
          <br/>
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
          <HomeTitle title='How To Play' color='#229246'/>
          <br/>
          {
            howTopPlay.map((x,i) => { 
              return <HowToPlayIconText key={i} name={x.name} link={x.link}/>})
          }
          <br/>
        </div>
        <br/>
        <br/>
        <BottomNav/>
        {/* <img src={'/static/icons/racehorse_plain.svg'} alt="none" height={300} width={300}/> */}
      </div>
      
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRedux(initStore, null, null)(withRoot(withStyles(styles)(Index)))
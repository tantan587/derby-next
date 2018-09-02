import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import LogoIcon from '../Icons/LogoIcon'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import HomeLogoIcon from '../Icons/HomeLogoIcon'

const styles = theme => ({
  root: {
    backgroundColor:'#48311A',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      padding: '12px 0px 20px 0px',
      justifyContent: 'space-around',
      '& > :first-child': {
        display: 'none'
      }
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  right: {
    [theme.breakpoints.down('xl')]: { marginRight: 50 },
    [theme.breakpoints.down('lg')]: { marginRight: 30 },
    [theme.breakpoints.down('md')]: { marginRight: 20 },
    [theme.breakpoints.down('sm')]: { marginRight: 20 },
    [theme.breakpoints.down('xs')]: { marginRight: 0 },
  },
  links: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      // flexDirection: 'row',
    }
  },
  flex: {
    flex: 1,
  },
})
class BottomNav extends React.Component {



  render() {
    const { classes, user } = this.props
    const items = user.loggedIn ? [
      { text: 'Home', link: '/' },
      { text: 'Rules', link: '/rules' },
      { text: 'FAQ', link: '/faq' },
      { text: 'Privacy Policy', link: '/privacy' },
      { text: 'Logout', link: '/logout' },] :
      [{ text: 'Home', link: '/' },
        { text: 'Rules', link: '/rules' },
        { text: 'FAQ', link: '/faq' },
        { text: 'Private Policy', link: '/privacy' },
        { text: 'Login', link: '/login' },
        { text: 'Sign Up', link: '/signup' }]

    return (
      <div className={classes.root}>
        <div style={{ display: 'inline-block', float: 'left' }}>
          <div style={{ height: 325, width: 325 }}>
            <LogoIcon color='#594632' viewbox='15 0 62 62' />
          </div>
        </div>
        <div className={classes.links}>
          {items.map((item, i) => {
            return <div key={i}>
              <Link href={item.link ? item.link : 'nolink'}>
                <Button style={{ fontSize: 16, color: 'white', width: 170 }}>
                  {item.text}
                </Button>
              </Link>
              <br />
            </div>

          })
          }
        </div>
        <div
          className={classes.right}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 350
          }}
        >
          <a style={{marginTop:10}} href='/' target="_blank">
            <HomeLogoIcon color={'white'} height={75} width={225} />
          </a>
          <br />
          <div style={{display:'flex', alignItems: 'center',}}>
            <a href='https://www.facebook.com/DerbyFantasy/'>
              <img src='/static/icons/Footer/social_media_icon_facebook.svg' width='50' height='auto' />
            </a>
            <a style={{marginLeft:20}} href="https://twitter.com/DerbyFantasy">
              <img src='/static/icons/Footer/social_media_icon_twitter.svg' width='50' height='auto' />
            </a>
          </div>
          <br />
          <a href="http://fantasydata.com/" target="_blank">
            <img src="https://fantasydata.com/images/badges/fantasydata-light-wide.png" alt="Powered by FantasyData.com" />
          </a>
          <div style={{ marginTop: 20 }}>
            <Typography variant="caption" style={{ color: 'white', textAlign: 'center' }} >
              All Rights Reserved. © 2018, Derby FWL, LLC
            </Typography>
            <Typography variant="caption" style={{ color: 'white', textAlign: 'center', fontSize: 8, width: 250 }} >
              DERBY FANTASY WINS LEAGUE and the unicorn trophy logo are trademarks of Derby FWL, LLC. All other trademarks shown on this site are the property of their respective owners. Derby Fantasy Wins League is not sponsored by, endorsed by or affiliated with any of the leagues or teams displayed herein.
            </Typography>
            <br/>
          </div>
        </div>
      </div>

    )
  }
}

export default connect(({ user}) => ({ user }),
  null)(withStyles(styles)(BottomNav))

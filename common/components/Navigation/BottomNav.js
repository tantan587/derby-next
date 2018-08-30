import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import LogoIcon from '../Icons/LogoIcon'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import HomeLogoIcon from '../Icons/HomeLogoIcon'

const styles = () => ({
  root: {
    flexGrow: 1,
    backgroundColor:'#48311A',
    textAlign: 'center',
    minHeight:325
  },
  flex: {
    flex: 1,
  },
})
class BottomNav extends React.Component {
  


  render() {
    const { classes, user } = this.props
    console.log(user.loggedIn)
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
        <div style={{ display: 'inline-block', float: 'left', marginLeft: 50, marginTop: 40 }}>
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
        <div style={{ float: 'right', marginRight: 50, marginTop: 20 }}>
          <a href='/' target="_blank">
            <HomeLogoIcon color={'white'} height={75} width={225} />
          </a>
          <br />
          <br />
          <div style={{ marginLeft: 0, display: 'inline-block' }}>
            <a href='https://www.facebook.com/DerbyFantasy/'>
              <img src='/static/icons/Footer/social_media_icon_facebook.svg' width='50' height='auto' />
            </a>
          </div>
          <div style={{ marginLeft: 20, display: 'inline-block' }}>
            <a href="https://twitter.com/DerbyFantasy">
              <img src='/static/icons/Footer/social_media_icon_twitter.svg' width='50' height='auto' />
            </a>
          </div>
          <br />
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
          </div>
        </div>
      </div>

    )
  }
}

export default connect(({ user}) => ({ user }),
  null)(withStyles(styles)(BottomNav))
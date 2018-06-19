import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import LogoIcon from '../Icons/LogoIcon'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Link from 'next/link'
import HomeLogoIconSmall from '../Icons/HomeLogoIconSmall'
import Patterns from '../Icons/Avatars/Patterns'
import Silk from '../Icons/Avatars/Silk'
import Horse from '../Icons/Avatars/Horse'

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
    const {classes, user} = this.props
    console.log(user.loggedIn)
    const items = user.loggedIn ? [
      {text:'Home', link:'/'},
      {text:'Rules', link:''},
      {text:'FAQ', link:''},
      {text:'Private Policy', link:''},
      {text:'Logout', link:'/logout'},] :
      [ {text:'Home', link:'/'},
        {text:'Login', link:'/login'},
        {text:'Sign Up', link:'/signup'},
        {text:'Rules', link:''},
        {text:'FAQ', link:''},
        {text:'Private Policy', link:''}]

    return (
      <div className={classes.root}>
        <div style={{display:'inline-block',float:'left'}}>
          <div style={{height:325, width:325}}>
            <LogoIcon color='#594632' viewbox='15 0 62 62'/>
          </div>
        </div>
        <div style={{display:'inline-block',float:'left', marginLeft:50, marginTop:40}}>
          {items.map((item, i) => { 
            return <div key={i}>
              <Link  href={item.link ? item.link : 'nolink'}>
                <Button  style={{fontSize:16, color:'white', width:170}}>
                  {item.text}            
                </Button>               
              </Link>
              <br/>
            </div>
            
          })
          }
        </div>
        <div style={{float:'right', marginRight:100, marginTop:50}}>
          <a href='/' target="_blank">
            <HomeLogoIconSmall color={'white'}/>
          </a>
          <br/>
          <br/>
          <br/>
          <br/>
          <div style={{marginLeft:0, display: 'inline-block'}}>
            <img src='/static/icons/Footer/social_media_icon_facebook.svg' width='50' height='auto'/>
          </div>
          <div style={{marginLeft:20, display: 'inline-block'}}>
            <img src='/static/icons/Footer/social_media_icon_twitter.svg' width='50' height='auto'/>
          </div>
          <br/>
          <br/>
          <a href="http://fantasydata.com/" target="_blank">
            <img src="https://fantasydata.com/images/badges/fantasydata-light-wide.png" alt="Powered by FantasyData.com"/>
          </a>
          <div style={{marginTop:20}}>
            <Typography variant="caption" gutterBottom style={{color:'white', textAlign:'center'}} >
              Copyright 2018 Derby Fantasy Wins League
            </Typography>
          </div>
        </div>
      </div>

    )
  }
}

export default connect(({ user}) => ({ user }),
  null)(withStyles(styles)(BottomNav))
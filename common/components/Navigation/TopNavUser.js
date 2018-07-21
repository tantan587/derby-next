const R = require('ramda')
import React from 'react'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import HamburgerIcon from '@material-ui/icons/Reorder'

import MenuButton from './Buttons/MenuButton'
import LeaguesButton from './Buttons/LeaguesButton'
import {toggleMobileNav} from '../../actions/status-actions'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor:'white'
  },
  toolbar: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  flex: {
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    float: 'right'
  },
  toolbarHeight :{
    height:30,
    maxHeight:30,
  },
  hamburger: {
    position: 'absolute',
    left: 0,
    color: 'white',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
})
class TopNavUser extends React.Component {
  
  state = {
    hoverIndex:-1
  };


  setHover = (hoverIndex) =>
  {
    this.setState({hoverIndex:hoverIndex})
  }
 
  setHoverToButton = (buttonType, index, loggedIn, link, name) =>
  {
    let hoverColor = this.state.hoverIndex===index?'#EBAB38':'white'
    return <div
      onMouseEnter={() => this.setHover(index)} 
      onMouseLeave={() => this.setHover(-1)} 
      style={{display:'inline-flex'}}>
      {buttonType == 'league'  
        ? loggedIn ? <LeaguesButton color={hoverColor} /> : <div/> 
        : buttonType == 'home' 
          ? <MenuButton color={hoverColor} link={link} name={name} isHomeLogo={true}/>
          : <MenuButton color={hoverColor} link={link} name={name}/>
      }
    </div> 
  }

  render() {
    const {classes, user, toggleMobileNav} = this.props
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{backgroundColor:'229246', color:'white'}}>
          <div style={{backgroundColor:'#00642C', height:30}}/>
          <Toolbar className={classes.toolbar}>
            <Button className={classes.hamburger} variant="extendedFab" onClick={toggleMobileNav}>
              <HamburgerIcon />
            </Button>
            
            {this.setHoverToButton('home', 0, user.loggedIn, '/')} 
            <div className={classes.flex}>
              {this.setHoverToButton('league', 1, user.loggedIn)}  
              {this.setHoverToButton('default', 2, user.loggedIn, '/participate', 'Create/Join League')}
              {this.setHoverToButton('default', 3, user.loggedIn, '', 'Rules')}
              {this.setHoverToButton('default', 4, user.loggedIn, '', 'FAQ')}
              {this.setHoverToButton('default', 5, user.loggedIn, '/scoreboard', 'Scoreboard')}
              <div style={{float:'right'}}>
                {user.loggedIn ?
                  this.setHoverToButton('default', 6, user.loggedIn, '/logout', 'Logout')
                  :
                  <div>
                    {this.setHoverToButton('default', 6, user.loggedIn, '/login', 'Login')}
                    {this.setHoverToButton('default', 7, user.loggedIn, '/signup', 'Sign Up')}
                  </div>
                }
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default R.compose(
  withStyles(styles),
  connect(R.pick(['user']), {toggleMobileNav: toggleMobileNav('TopNavUser')}),
)(TopNavUser)
const R = require('ramda')
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import HamburgerIcon from '@material-ui/icons/Reorder'
import { connect } from 'react-redux'
import LogoutButton from './Buttons/LogoutButton'
import LoginButton from './Buttons/LoginButton'
import MenuButton from './Buttons/MenuButton'
import LeaguesButton from './Buttons/LeaguesButton'
//import AdminButton from './Buttons/AdminButton'
import {toggleMobileNav, setMobileNavVariant} from '../../actions/status-actions'

const styles = (theme) => ({
  root: {
    //flexGrow: 1,
    backgroundColor:'white',
    textAlign: 'center'
  },
  flexTop: {
    marginBottom: 10,
    flex:1,
    [theme.breakpoints.down('sm')]: {
      marginLeft:'-7%' 
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 100,
    }
  },
  flexBottom: {
    flex: 1,
    justifyContent: 'center',
    top: -10,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    float: 'right'
  },
  hamburger: {
    float:'left',
    color: theme.palette.primary.main,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  },
  logInOut: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logo: {
    maxWidth: 300,
    maxHeight: 100,
    width: '100%',
    height: '100%',
  }
})
class TopNavHome extends React.Component {
  componentDidMount() {
    this.props.setMobileNavVariant('TopNavHomeVariant')
  }
  state = {
    hoverIndex:-1
  };


  setHover = (hoverIndex) =>
  {
    this.setState({hoverIndex:hoverIndex})
  }

  setHoverToButton = (buttonType, index, loggedIn, link, name) =>
  {
    let hoverColor = this.state.hoverIndex===index?'#EBAB38':'#269349'
    return <div
      onMouseEnter={() => this.setHover(index)} 
      onMouseLeave={() => this.setHover(-1)} 
      style={{display:'inline-flex'}}>
      {buttonType == 'league'  
        ? loggedIn ? <LeaguesButton name='My Leagues' color={hoverColor} backgroundColor='white'/> : <div/> 
        : <MenuButton color={hoverColor} backgroundColor='#ffffff' link={link} name={name}/>
      }
    </div> 
  }

  render() {
    const {classes, user, toggleMobileNav} = this.props
    //className={classes.hamburger} 
    
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{backgroundColor:'white', color:'black'}}>
          <Toolbar>
            <Button size='small' className={classes.hamburger} style={{marginLeft:-20}}  onClick={toggleMobileNav}> 
              <HamburgerIcon/>
            </Button>
            <div className={classes.flexTop} >
              <img src='/static/icons/derby_home_logo.svg' alt="ok" className={classes.logo}/>
            </div> 
            {!this.props.user.loggedIn ?
              <div className={classes.logInOut}>
                <LoginButton className={classes.logInOut} color='#707070' backgroundColor='#ffffff'/>
              </div>
              :
              <div className={classes.logInOut}>
                <LogoutButton  color='#707070' backgroundColor='#ffffff'/>
                {/* <AdminButton color='#707070' backgroundColor='#ffffff'/> */}
              </div>
            }
            <br/>

          </Toolbar>
          <Toolbar>
            <div  className={classes.flex}>
              {this.setHoverToButton('league', 0, user.loggedIn)}
              {this.setHoverToButton('default', 1, user.loggedIn, '/participate', 'Create/Join League')}
              {this.setHoverToButton('default', 2, user.loggedIn, '/rules', 'Rules')}
              {this.setHoverToButton('default', 3, user.loggedIn, '', 'FAQ')}
              {this.setHoverToButton('default', 4, user.loggedIn, '/scoreboard', 'Scoreboard')}
            </div>
          </Toolbar>
        </AppBar>
      </div>

    )
  }
}

export default R.compose(
  withStyles(styles),
  connect(R.pick(['user']), {toggleMobileNav: toggleMobileNav('TopNavHomeVariant'), setMobileNavVariant}),
)(TopNavHome)
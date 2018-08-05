const R = require('ramda')
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { connect } from 'react-redux'
import MenuButton from './Buttons/MenuButton'
import LeaguesButton from './Buttons/LeaguesButton'
import LeagueExtraButton from './Buttons/LeagueExtraButton'
import HamburgerIcon from '@material-ui/icons/Reorder'
import Button from '@material-ui/core/Button'
import {toggleMobileNav, setMobileNavVariant} from '../../actions/status-actions'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor:'white', 
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
class TopNavLeague extends React.Component {
  componentDidMount() {
    this.props.setMobileNavVariant('TopNavLeagueVariant')
  }
  state = {
    hoverIndex:-1
  };


  setHover = (hoverIndex) =>
  {
    this.setState({hoverIndex:hoverIndex})
  }
 
  setHoverToButton = (buttonType, index, link, name) =>
  {
    let hoverColor = this.state.hoverIndex===index?'#EBAB38':'white'
    return <div
      onMouseEnter={() => this.setHover(index)} 
      onMouseLeave={() => this.setHover(-1)} 
      style={{display:'inline-flex'}}>
      {buttonType == 'league'  
        ? <LeaguesButton name='Leagues' color={hoverColor}/>
        : buttonType == 'extra' ?
          <LeagueExtraButton color={hoverColor} name={name}/>
          : buttonType == 'home' 
            ? <MenuButton color={hoverColor} link={link} name={name} isHomeLogo={true}/>
            : <MenuButton color={hoverColor} link={link} name={name}/>
      }
    </div> 
  }

  render() {
    const {classes, toggleMobileNav} = this.props
    
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{backgroundColor:'229246', color:'white'}}>
          <div style={{backgroundColor:'#00642C', height:30}}/>
          <Toolbar className={classes.toolbar}>
            <Button className={classes.hamburger} variant="flat" onClick={toggleMobileNav}>
              <HamburgerIcon />
            </Button>

            {this.setHoverToButton('home', 0, '/')} 
            <div  className={classes.flex}>
              {this.setHoverToButton('extra', 1,  null, this.props.activeLeague.league_name)}
              {this.setHoverToButton('default', 2,  '/mainleaguestandings', 'Standings')}
              {this.setHoverToButton('default', 3,  '/mainleagueschedule', 'Schedules')}
              {this.setHoverToButton('default', 4,  '/mainleagueroster', 'Rosters')}
              {this.setHoverToButton('default', 5, '/mainleagueteams', 'Teams')}
              {this.setHoverToButton('league', 6)}
              <div style={{float:'right'}}>
                {this.setHoverToButton('default', 7, '/logout', 'Logout')
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
  connect(R.pick(['user', 'activeLeague']), {toggleMobileNav: toggleMobileNav('TopNavLeagueVariant'), setMobileNavVariant}),
)(TopNavLeague)
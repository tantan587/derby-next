import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import MenuButton from './Buttons/MenuButton'
import LeaguesButton from './Buttons/LeaguesButton'
import HomeLogoIconSmall from '../Icons/HomeLogoIconSmall'

const styles = () => ({
  root: {
    flexGrow: 1,
    backgroundColor:'white', 
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    float: 'right'
  },
  toolbarHeight :{
    height:30,
    maxHeight:30,
  }
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
    const {classes, user} = this.props
    
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{backgroundColor:'229246', color:'white'}}>
          <div style={{backgroundColor:'#00642C', height:30}}/>
          <Toolbar>
            {this.setHoverToButton('home', 0, user.loggedIn, '/')} 
            <div  className={classes.flex}>
              {this.setHoverToButton('league', 1, user.loggedIn)}  
              {this.setHoverToButton('default', 2, user.loggedIn, '/participate', 'Create/Join League')}
              {this.setHoverToButton('default', 3, user.loggedIn, '', 'Rules')}
              {this.setHoverToButton('default', 4, user.loggedIn, '', 'FAQ')}
              <div style={{float:'right'}}>
                {user.loggedIn ?
                  this.setHoverToButton('default', 5, user.loggedIn, '/logout', 'Logout')
                  :
                  <div>
                    {this.setHoverToButton('default', 5, user.loggedIn, '/login', 'Login')}
                    {this.setHoverToButton('default', 6, user.loggedIn, '/signup', 'Sign Up')}
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

export default connect(({ user}) => ({ user }),
  null)(withStyles(styles)(TopNavUser))
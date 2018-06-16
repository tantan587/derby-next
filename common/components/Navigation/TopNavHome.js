import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { connect } from 'react-redux'
import LogoutButton from './Buttons/LogoutButton'
import LoginButton from './Buttons/LoginButton'
import MenuButton from './Buttons/MenuButton'
import LeaguesButton from './Buttons/LeaguesButton'
import AdminButton from './Buttons/AdminButton'

const styles = () => ({
  root: {
    flexGrow: 1,
    backgroundColor:'white', 
    textAlign: 'center'
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    float: 'right'
  },
})
class TopNavHome extends React.Component {
  
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
        ? loggedIn ? <LeaguesButton color={hoverColor} backgroundColor='white'/> : <div/> 
        : <MenuButton color={hoverColor} backgroundColor='#ffffff' link={link} name={name}/>
      }
    </div> 
  }

  render() {
    const {classes, user} = this.props
    
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{backgroundColor:'white', color:'black'}}>
          <Toolbar>
            <div  className={classes.flex}>
              <img src='/static/icons/derby_home_logo.svg' alt="ok" width="300" height="100"/>
            </div> 
            {!this.props.user.loggedIn ?
              <LoginButton color='#707070' backgroundColor='#ffffff'/>
              :
              <div>
                <LogoutButton color='#707070' backgroundColor='#ffffff'/>
                <AdminButton color='#707070' backgroundColor='#ffffff'/>
              </div>
            }
            <br/>
            
          </Toolbar>
          <Toolbar>
            <div  className={classes.flex}>                         
              {this.setHoverToButton('league', 0, user.loggedIn)}  
              {this.setHoverToButton('default', 1, user.loggedIn, '/participate', 'Create/Join League')}
              {this.setHoverToButton('default', 2, user.loggedIn, '', 'Rules')}
              {this.setHoverToButton('default', 3, user.loggedIn, '', 'FAQ')}
            </div>
          </Toolbar>
        </AppBar>
      </div>

    )
  }
}

export default connect(({ user}) => ({ user }),
  null)(withStyles(styles)(TopNavHome))
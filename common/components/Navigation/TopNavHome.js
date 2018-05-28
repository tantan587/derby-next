import React from 'react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import { connect } from 'react-redux'
import LogoutButton from './Buttons/LogoutButton'
import LoginButton from './Buttons/LoginButton'
import MenuButton from './Buttons/MenuButton'
import LeaguesButton from './Buttons/LeaguesButton'

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
  
 

  render() {
    const {classes} = this.props
    
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
              <LogoutButton color='#707070' backgroundColor='#ffffff'/>
            }
            <br/>
            
          </Toolbar>
          <Toolbar>
            <div  className={classes.flex}>
              <LeaguesButton color='#229246' backgroundColor='#ffffff'/>
              <MenuButton color='#229246' backgroundColor='#ffffff' link='/participate' name='Create/Join League'/>
              <MenuButton color='#229246' backgroundColor='#ffffff' link='' name='Rules'/>
              <MenuButton color='#229246' backgroundColor='#ffffff' link='' name='FAQ'/>
            </div>
          </Toolbar>
        </AppBar>
      </div>

    )
  }
}

export default connect(({ user}) => ({ user }),
  null)(withStyles(styles)(TopNavHome))
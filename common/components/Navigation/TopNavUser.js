import React from 'react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import { connect } from 'react-redux'
import MenuButton from './Buttons/MenuButton'
import LeaguesButton from './Buttons/LeaguesButton'

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
  
 

  render() {
    const {classes, user} = this.props
    
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{backgroundColor:'229246', color:'white'}}>
          <div style={{backgroundColor:'#00642C', height:30}}/>
          <Toolbar>
            <img src='/static/icons/derby_home_logo_small.svg' style={{height:50}}/>
            <div  className={classes.flex}>
              {user.loggedIn ? <LeaguesButton color='white'/> : <div/>}
              <MenuButton color='white' link='/participate' name='Create/Join League'/>
              <MenuButton color='white'  link='' name='Rules'/>
              <MenuButton color='white'  link='' name='FAQ'/>
              <div style={{float:'right'}}>
                {user.loggedIn ?
                  <MenuButton color='white'  link='/logout' name='Logout'/>
                  :
                  <div>
                    <MenuButton color='white'  link='/login' name='Login'/>
                    <MenuButton color='white'  link='/signup' name='Signup'/>
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
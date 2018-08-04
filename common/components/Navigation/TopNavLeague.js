import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
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
        ? <LeaguesButton color={hoverColor} useItems2={true} />
        : buttonType == 'home' 
          ? <MenuButton color={hoverColor} link={link} name={name} isHomeLogo={true}/>
          : <MenuButton color={hoverColor} link={link} name={name}/>
      }
    </div> 
  }

  render() {
    const {classes} = this.props
    
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{backgroundColor:'229246', color:'white'}}>
          <div style={{backgroundColor:'#00642C', height:30}}/>
          <Toolbar>
            {this.setHoverToButton('home', 0, '/')} 
            <div  className={classes.flex}>
              {this.setHoverToButton('default', 1,  '/mainleaguehome', 'League Home')}
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

export default connect(({ user}) => ({ user }),
  null)(withStyles(styles)(TopNavUser))
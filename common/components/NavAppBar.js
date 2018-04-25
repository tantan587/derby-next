import Link from 'next/link'
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import { connect } from 'react-redux'
import {clickedLeague} from '../actions/fantasy-actions'
import {clickedStandings, clickedSportLeagues} from '../actions/sport-actions'
import {isMobile} from '../lib/mobile'
import { handledPressedLogin, clickedAdminUpdates } from '../actions/auth-actions'

const styles = theme => ({
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
    fontFamily: 'Tinos',
    //fontFamily: 'HorsebackSlab',
  },
  appBar: {
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.secondary[100]

  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  drawerPaper: {
    height: '100%',
    width: '200px',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
})

class NavAppBar extends React.Component {
  state = {
    open: false,
    leaguesOpen: false
  };

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  handleLeagueClick = (league_id) => {
    const { onClickedLeague, onStandings, onSportLeagues } = this.props
    this.toggleDrawer()
    onClickedLeague(league_id, this.props.user.id)
    onStandings(league_id)
    onSportLeagues(league_id)
  }

  handleAdminUpdates = () =>
  {
    //this.props.onAdminUpdates()
  }

  toggleLeagueList = () => {
    this.setState({ leaguesOpen: !this.state.leaguesOpen })
  };

  pressedLogin = () => {
    const { onPressedLogin } = this.props
    onPressedLogin()
  };

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{height:'60px'}}>
          <Toolbar className={classes.appBar}>
            <IconButton 
              className={classes.menuButton} 
              aria-label="Menu"
              onClick={this.toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {isMobile() ? 'Derby' :'Derby. Fantasy Wins League'}
            </Typography>
            {this.props.user.loggedIn ? 
              <div>
                <Link href="/logout">
                  <Button style={{float: 'right', color:'white'}}>Logout</Button>
                </Link>
              </div>
              : 
              <div>
                <Button style={{float: 'right', color:'white'}}  onClick={() => {this.pressedLogin()}}>
                  <Link href="/signup">
                    <div color={'white'}>
                      Signup
                    </div>
                  </Link>
                </Button>
                <Button style={{float: 'right', color:'white'}} onClick={() => {this.pressedLogin()}}>
                  <Link href="/login">
                    <div>
                      Login
                    </div>
                  </Link>
                </Button>
              </div>}
            
          </Toolbar>
        </AppBar>
        <Drawer 
          open={this.state.open} 
          onClose={this.toggleDrawer}
          classes={{
            paper: classes.drawerPaper,
          }}>
          <div
            tabIndex={0}
            role="button"
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem button onClick={this.toggleDrawer}>
                <Link href="/">
                  <ListItemText primary="Derby Home" />
                </Link>
              </ListItem>
              {this.props.leagues.length !== 0 ?
                <div>
                  <ListItem button onClick={this.toggleLeagueList}>
                    <ListItemText primary="My Leagues" />
                    {this.state.leaguesOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse component="li" in={this.state.leaguesOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {this.props.leagues.map((league, i) =>
                        (
                          <ListItem id={i} key={i} button onClick={() => {this.handleLeagueClick(league.league_id)}}>
                            <Link href='/mainleaguestandings'>
                              <ListItemText style={{paddingLeft:'18px'}} primary={league.league_name} />
                            </Link>
                          </ListItem>

                        ))}
                    </List>
                  </Collapse>
                </div>
                :
                <div></div>
              }
              {this.props.user.loggedIn === true ?
                <div>
                  <Link href="/participate">
                    <ListItem button >
                      <ListItemText primary="Create/Join League" />
                    </ListItem>
                  </Link>
                </div>
                :
                <div></div>
              }
              <ListItem button>
                <ListItemText primary="FAQ" />
              </ListItem>
              {
                this.props.user.username !== 'tantan587'
                  ? <div></div>
                  :
                  <ListItem button onClick={() => {this.handleAdminUpdates()}} >
                    <ListItemText primary="Make updates" />
                  </ListItem>
              }
            </List>
          </div>
        </Drawer>
      </div>
    )
  }
}

NavAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(({ user, leagues }) => ({ user, leagues }),
  dispatch =>
    ({
      onPressedLogin() {
        dispatch(
          handledPressedLogin())
      },
      onClickedLeague(league_id, user_id) {
        dispatch(
          clickedLeague(league_id, user_id))
      },
      onStandings(league_id) {
        dispatch(
          clickedStandings(league_id))
      },
      onSportLeagues(league_id) {
        dispatch(
          clickedSportLeagues(league_id))
      },
      onAdminUpdates() {
        dispatch(
          clickedAdminUpdates())
      }
    }))(withStyles(styles)(NavAppBar))
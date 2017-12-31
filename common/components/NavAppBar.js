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
import {clickedStandings} from '../actions/sport-actions'
import {isMobile} from '../lib/mobile'

const styles = theme => ({
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  appBar: {
    backgroundColor: theme.palette.primary[800],
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
    const { onClickedLeague, onStandings } = this.props
    this.toggleDrawer()
    onClickedLeague(league_id)
    onStandings(league_id)
  }

  toggleLeagueList = () => {
    this.setState({ leaguesOpen: !this.state.leaguesOpen })
  };

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{height:'60px'}}>
          <Toolbar className={classes.appBar}>
            <IconButton 
              className={classes.menuButton} 
              color="contrast" 
              aria-label="Menu"
              onClick={this.toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              {isMobile() ? 'Derby' :'Derby. Fantasy Wins League'}
            </Typography>
            {this.props.user.loggedIn ? 
              <div>
                <Link href="/logout">
                  <Button style={{float: 'right'}} color="contrast">Logout</Button>
                </Link>
              </div>
              : 
              <div>
                <Link href="/signup">
                  <Button style={{float: 'right'}} color="contrast">Signup</Button>
                </Link>
                <Link href="/login">
                  <Button style={{float: 'right'}} color="contrast">Login</Button>
                </Link>
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
                          <ListItem id={i} button onClick={() => {this.handleLeagueClick(league.league_id)}}>
                            <Link href='/mainleague'>
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
                    <ListItem button>
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
      onClickedLeague(league_id) {
        dispatch(
          clickedLeague(league_id))
      },
      onStandings(league_id) {
        dispatch(
          clickedStandings(league_id))
      }
    }))(withStyles(styles)(NavAppBar))

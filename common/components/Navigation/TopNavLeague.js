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
import { toggleMobileNav, setMobileNavVariant } from '../../actions/status-actions'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'white',
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
    [theme.breakpoints.only('md')]: {
      '& button': {
        paddingLeft: 10,
        paddingRight: 10,
      }
    }
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    float: 'right'
  },
  toolbarHeight: {
    height: 30,
    maxHeight: 30,
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
    hoverIndex: -1
  }


  setHover = (hoverIndex) => {
    this.setState({ hoverIndex: hoverIndex })
  }

  setHoverToButton = (buttonType, index, link, name, items) => {
    let hoverColor = this.state.hoverIndex === index ? '#EBAB38' : 'white'
    return <div
      onMouseEnter={() => this.setHover(index)}
      onMouseLeave={() => this.setHover(-1)}
      style={{ display: 'inline-flex' }}>
      {buttonType == 'league'
        ? <LeaguesButton name='Leagues' color={hoverColor} />
        : buttonType == 'extra' ?
          <LeagueExtraButton color={hoverColor} name={name} items={items} />
          : buttonType == 'home'
            ? <MenuButton color={hoverColor} link={link} name={name} isHomeLogo={true} />
            : <MenuButton color={hoverColor} link={link} name={name} />
      }
    </div>
  }

  render() {
    const { classes, activeLeague, toggleMobileNav } = this.props

    const leagueItems = [
      { text: 'League Home', link: '/mainleaguehome' },
      { text: 'Draft Room', link: '/livedraft' },
      { text: 'Team Settings', link: '/mainleagueteamsettings' },
      ...(activeLeague.imTheCommish ? [{ text:'Commish Tools', link:'/mainleaguesettings' }] : [])
    ]

    const rosterItems = [
      { text: 'By Owner', link: '/mainleagueroster' },
      { text: 'Grid View', link: '/draftgrid' },
    ]

    return (
      <div className={classes.root}>
        <AppBar position="static" style={{ backgroundColor: '229246', color: 'white' }}>
          <Toolbar className={classes.toolbar}>
            <Button className={classes.hamburger} variant="flat" onClick={toggleMobileNav}>
              <HamburgerIcon />
            </Button>

            {this.setHoverToButton('home', 0, '/')}
            <div className={classes.flex}>
              {this.setHoverToButton('extra', 1, null, activeLeague.league_name, leagueItems)}
              {this.setHoverToButton('default', 2, '/mainleaguestandings', 'Standings')}
              {this.setHoverToButton('default', 3, '/mainleaguescoreboard', 'Scoreboard')}
              {activeLeague.draftInfo && activeLeague.draftInfo.mode === 'post' ?
                this.setHoverToButton('extra', 4, null, 'Rosters', rosterItems) :
                this.setHoverToButton('default', 4, '/mainleagueroster', 'Rosters')}
              {this.setHoverToButton('default', 5, '/mainleagueteams', 'Teams')}
              {activeLeague.draftInfo && activeLeague.draftInfo.mode === 'post' && this.setHoverToButton('default', 6, '/draftrecap', 'Draft Recap')}
              {this.setHoverToButton('league', 7)}
              <div style={{ float: 'right' }}>
                {this.setHoverToButton('default', 8, '/logout', 'Log out')}
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
  connect(R.pick(['user', 'activeLeague']), { toggleMobileNav: toggleMobileNav('TopNavLeagueVariant'), setMobileNavVariant }),
)(TopNavLeague)

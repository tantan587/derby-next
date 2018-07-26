const R = require('ramda')
import React from 'react'
import {connect} from 'react-redux'
import Link from 'next/link'
import classNames from 'classnames'
import {withRouter} from 'next/router'

import {withStyles} from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import HomeIcon from '@material-ui/icons/Home'
import PublicIcon from '@material-ui/icons/Public'
import HelpIcon from '@material-ui/icons/Help'
import AssignmentIcon from '@material-ui/icons/Assignment'
import PollIcon from '@material-ui/icons/Poll'
import PersonIcon from '@material-ui/icons/Person'

import HomeLogoIcon from '../../Icons/HomeLogoIcon'
import LinkHelper from '../LinkHelper'
import {hideMobileNav} from '../../../actions/status-actions'
import {clickedLeague} from '../../../actions/fantasy-actions'

import styles from './styles'

const pathnameEqToHref = R.curry((pathname, href) => pathname === href)

const LEAGUE_LINKS = [
  {
    text:'League Home',
    link:'/mainleague',
  }, {
    text:'Draft Room',
    link:'/livedraft',
  }, {
    text:'Message Board',
    link:'/livedraft',
  }, {
    text:'News',
    link:'/livedraft',
  }, {
    text:'League Settings',
    link:'/mainleagues',
  }, {
    text:'Commish Tools',
    link:'/livedraft',
  }
]

const TopNavLeagueVariant = ({
  classes,
  router,
  toggleData,
  toggle,
  user,
  leagues,
  activeLeague,
  clickedLeague,
  hideMobileNav,
}) => {
  const isActive = pathnameEqToHref(router.pathname)
  const userLeagues = toggleData.userLeagues
  const userProfile = toggleData.userProfile
  const userActiveLeague = toggleData.userActiveLeague

  return (
    <List>
      <ListItem
        button
      >
        <Link href="/">
          <a>
            <HomeLogoIcon
              className={classes.logo}
              color="white"
              height="50"
              width="160"
            />
          </a>
        </Link>
      </ListItem>
      <LinkHelper 
        href="/"
        children="DERBY HOME"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/')}),
          linkAnchor: classes.linkAnchor,
        }}
        Icon={HomeIcon}
        onClick={hideMobileNav}
      />
      <LinkHelper 
        href="/participate"
        children="CREATE/JOIN LEAGUE"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/participate')}),
          linkAnchor: classes.linkAnchor,
        }}
        Icon={PublicIcon}
        onClick={hideMobileNav}
      />
      <LinkHelper 
        href="/"
        children="RULES"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/rules')}),
          linkAnchor: classes.linkAnchor,
        }}
        Icon={AssignmentIcon}
        onClick={hideMobileNav}
      />
      <LinkHelper 
        href="/"
        children="FAQ"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/faq')}),
          linkAnchor: classes.linkAnchor,
        }}
        Icon={HelpIcon}
        onClick={hideMobileNav}
      />
      <LinkHelper 
        href="/scoreboard"
        children="SCOREBOARD"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/scoreboard')}),
          linkAnchor: classes.linkAnchor,
        }}
        Icon={PollIcon}
        onClick={hideMobileNav}
      />

      {user.loggedIn && <LinkHelper 
        href="javascript:void(0)"
        children={user.username}
        endAdornment={userProfile ? <ExpandLess /> : <ExpandMore />}
        classes={classes}
        Icon={PersonIcon}
        parent={true}
        onClick={() => toggle('userProfile')}
      />}

      {user.loggedIn && <Collapse className={classes.nestedContainer} in={userProfile}>
        <LinkHelper 
          href="/"
          children="SETTINGS"
          classes={{
            link: classes.link,
            linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: isActive('/')}),
          }}
          Icon={() => ""}
        />
        <LinkHelper 
          href="/logout"
          children="LOGOUT"
          classes={{
            link: classes.link,
            linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: isActive('/')}),
          }}
          Icon={() => ""}
        />
      </Collapse>}

      {(user.loggedIn && leagues.length) && <LinkHelper 
        href="javascript:void(0)"
        children="LEAGUES"
        endAdornment={userLeagues ? <ExpandLess /> : <ExpandMore />}
        classes={classes}
        Icon={() => ""}
        parent={true}
        onClick={() => toggle('userLeagues')}
      />}

      {(user.loggedIn && leagues.length) && <Collapse className={classes.nestedContainer} in={userLeagues}>
        {leagues.map((league) => (
          <LinkHelper
            key={league.league_id} 
            href="javascript:void(0)"
            children={league.league_name}
            classes={{
              link: classes.link,
              linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: activeLeague.league_id === league.league_id}),
            }}
            Icon={() => ""}
            onClick={() => {
              hideMobileNav()
              clickedLeague(league.league_id, user.id)
            }}
          />  
        ))}
      </Collapse>}

      {(user.loggedIn === false) && <LinkHelper 
        href="/login"
        children="LOGIN"
        classes={{
          link: classes.link,
          linkAnchor: classNames(classes.linkAnchor, {[classes.activeLink]: isActive('/login')}),
        }}
        Icon={() => ""}
        onClick={hideMobileNav}
      />}

      {(user.loggedIn === false) && <LinkHelper 
        href="/signup"
        children="SIGNUP"
        classes={{
          link: classes.link,
          linkAnchor: classNames(classes.linkAnchor, {[classes.activeLink]: isActive('/signup')}),
        }}
        Icon={() => ""}
        onClick={hideMobileNav}
      />}

      {!!activeLeague.league_name && <LinkHelper 
        href="javascript:void(0)"
        children={activeLeague.league_name}
        endAdornment={userActiveLeague ? <ExpandLess /> : <ExpandMore />}
        classes={classes}
        Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>AL</Typography>}
        parent={true}
        onClick={() => toggle('userActiveLeague')}
      />}

      {!!activeLeague.league_name && <Collapse className={classes.nestedContainer} in={userActiveLeague}>
        {LEAGUE_LINKS.map((LL) => (
          <LinkHelper
            key={LL.text} 
            href={LL.link}
            children={LL.text}
            classes={{
              link: classes.link,
              linkAnchor: classNames(classes.nested, classes.linkAnchor),
            }}
            Icon={() => ""}
            onClick={hideMobileNav}
          />  
        ))}
      </Collapse>}

      <LinkHelper 
        href="/mainleaguestandings"
        children="STANDINGS"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/mainleaguestandings')}),
          linkAnchor: classes.linkAnchor,
        }}
        Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>S</Typography>}
        onClick={hideMobileNav}
      />
      <LinkHelper 
        href="/mainleagueroster"
        children="ROSTERS"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/mainleagueroster')}),
          linkAnchor: classes.linkAnchor,
        }}
        Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>R</Typography>}
        onClick={hideMobileNav}
      />
      <LinkHelper 
        href="/mainleagueteams"
        children="TEAMS"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/mainleagueteams')}),
          linkAnchor: classes.linkAnchor,
        }}
        Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>T</Typography>}
        onClick={hideMobileNav}
      />

    </List>
  )
}

function mapStateToProps(state) {
  return {
    user: state.user,
    leagues: state.leagues,
    activeLeague: state.activeLeague,
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, {hideMobileNav, clickedLeague}),
)(TopNavLeagueVariant)

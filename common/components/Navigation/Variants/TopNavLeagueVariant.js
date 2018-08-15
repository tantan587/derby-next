const R = require('ramda')
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
import PersonIcon from '@material-ui/icons/Person'
import HomeLogoIcon from '../../Icons/HomeLogoIcon'
import {hideMobileNav} from '../../../actions/status-actions'
import {clickedLeague} from '../../../actions/fantasy-actions'
import styles from './styles'
import LinkHelper from '../LinkHelper'

const pathnameEqToHref = R.curry((pathname, href) => pathname === href)




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
  const LEAGUE_LINKS = [
    {
      text:'League Home',
      link:'/mainleague',
    }, {
      text:'Draft Room',
      link:'/livedraft',
    }, {
      text:'League Settings',
      link:'/mainleagues',
    }
  ]
  if(activeLeague.imTheCommish)
  {
    LEAGUE_LINKS.push({ 
      text:'Commish Tools', 
      link:'/mainleaguesettings'})
  }
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
        children="Derby Home"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/')}),
          linkAnchor: classes.linkAnchor,
          text: classNames(classes.text, {[classes.activeText]: isActive('/')})
        }}
        Icon={HomeIcon}
        onClick={hideMobileNav}
      />
      {/* <LinkHelper 
        href="/scoreboard"
        children="SCOREBOARD"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/scoreboard')}),
          linkAnchor: classes.linkAnchor,
        }}
        Icon={PollIcon}
        onClick={hideMobileNav}
      /> */}

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
        {/* <LinkHelper 
          href="/"
          children="SETTINGS"
          classes={{
            link: classes.link,
            linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: isActive('/')}),
          }}
          Icon={() => ""}
        /> */}
        <LinkHelper 
          href="/logout"
          children="Log Out"
          classes={{
            link: classes.link,
            text: classNames(classes.text, {[classes.activeText]: isActive('/')}),
            linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: isActive('/')}),
          }}
          Icon={() => ''}
        />
      </Collapse>}



      {(user.loggedIn === false) && <LinkHelper
        href="/login"
        children="Log In"
        classes={{
          link: classes.link,
          linkAnchor: classNames(classes.linkAnchor, {[classes.activeLink]: isActive('/login')}),
          text: classNames(classes.text, {[classes.activeText]: isActive('/login')}),
        }}
        Icon={() => ''}
        onClick={hideMobileNav}
      />}

      {(user.loggedIn === false) && <LinkHelper 
        href="/signup"
        children="Sign Up"
        classes={{
          link: classes.link,
          linkAnchor: classNames(classes.linkAnchor, {[classes.activeLink]: isActive('/signup')}),
          text: classNames(classes.text, {[classes.activeText]: isActive('/signup')}),
        }}
        Icon={() => ''}
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
              text: classNames(classes.text, {[classes.activeText]: isActive(LL.link)}),
            }}
            Icon={() => ''}
            onClick={hideMobileNav}
          />  
        ))}
      </Collapse>}

      <LinkHelper
        href="/mainleaguestandings"
        children="Standings"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/mainleaguestandings')}),
          linkAnchor: classes.linkAnchor,
          text: classNames(classes.text, {[classes.activeText]: isActive('/mainleaguestandings')}),
        }}
        Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>S</Typography>}
        onClick={hideMobileNav}
      />
      <LinkHelper
        href="/mainleaguescoreboard"
        children="Scoreboard"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/mainleaguescoreboard')}),
          linkAnchor: classes.linkAnchor,
          text: classNames(classes.text, {[classes.activeText]: isActive('/mainleaguescoreboard')}),
        }}
        Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>S</Typography>}
        onClick={hideMobileNav}
      />
      <LinkHelper 
        href="/mainleagueroster"
        children="Rosters"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/mainleagueroster')}),
          linkAnchor: classes.linkAnchor,
          text: classNames(classes.text, {[classes.activeText]: isActive('/mainleagueroster')}),
        }}
        Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>R</Typography>}
        onClick={hideMobileNav}
      />
      <LinkHelper 
        href="/mainleagueteams"
        children="Teams"
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive('/mainleagueteams')}),
          linkAnchor: classes.linkAnchor,
          text: classNames(classes.text, {[classes.activeText]: isActive('/mainleagueteams')}),
        }}
        Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>T</Typography>}
        onClick={hideMobileNav}
      />
      {(user.loggedIn && leagues.length) && <LinkHelper 
        href="javascript:void(0)"
        children="Leagues"
        endAdornment={userLeagues ? <ExpandLess /> : <ExpandMore />}
        classes={classes}
        Icon={() => ''}
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
              text: classNames(classes.text, {[classes.activeText]: activeLeague.league_id === league.league_id}),
              linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: activeLeague.league_id === league.league_id}),
            }}
            Icon={() => ''}
            onClick={() => {
              hideMobileNav()
              clickedLeague(league.league_id, user.id)
            }}
          />  
        ))}
      </Collapse>}

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

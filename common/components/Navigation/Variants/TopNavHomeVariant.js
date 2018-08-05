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

const TopNavHomeVariant = ({
  classes,
  router,
  toggleData,
  toggle,
  user,
  leagues,
  hideMobileNav,
  clickedLeague,
}) => {
  const isActive = pathnameEqToHref(router.pathname)
  const userLeagues = toggleData.userLeagues
  const userProfile = toggleData.userProfile

  const allLinks = [
    {name: 'Derby Home', link:'/', icon:HomeIcon},
    {name: 'Create/Join League', link:'/participate', icon:PublicIcon},
    {name: 'Rules', link:'/rules', icon:AssignmentIcon},
    {name: 'FAQ', link:'/faq', icon:HelpIcon},
    {name: 'Scoreboard', link:'/scoreboard', icon:PollIcon},
  ]
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
      {allLinks.map((x,i) => <LinkHelper
        key={i}
        href={x.link}
        children={x.name}
        classes={{
          link: classNames(classes.link, {[classes.activeLink]: isActive(x.link)}),
          linkAnchor: classes.linkAnchor,
          text: classNames(classes.text, {[classes.activeText]: isActive(x.link)})
        }}
        Icon={x.icon}
        onClick={hideMobileNav}
      />)}
      
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
          Icon={() => ''}
          onClick={hideMobileNav}
        /> */}
        <LinkHelper 
          href="/logout"
          children="Log Out"
          classes={{
            link: classes.link,
            linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: isActive('/logout')}),
            text:classNames(classes.text, {[classes.activeText]: isActive('/logout')})
          }}
          Icon={() => ''}
          onClick={hideMobileNav}
        />
      </Collapse>}

      {(user.loggedIn && leagues.length) && <LinkHelper
        href="javascript:void(0)"
        children="Leagues"
        endAdornment={userLeagues ? <ExpandLess /> : <ExpandMore />}
        classes={classes}
        Icon={() => ''}
        parent={true}
        onClick={() => toggle('userLeagues')}
      />}

      {user.loggedIn && <Collapse className={classes.nestedContainer} in={userLeagues}>
        {leagues.length ? (
          leagues.map((league) => (
            <LinkHelper
              key={league.league_id} 
              href="/mainleaguehome"
              children={league.league_name}
              classes={{
                link: classes.link,
                linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: isActive('/mainleaguehome')}),
                text:classNames(classes.text, {[classes.activeText]: isActive('/mainleaguehome')})
              }}
              Icon={() => ''}
              onClick={() => {
                hideMobileNav()
                clickedLeague(league.league_id, user.id)
              }}
            />  
          ))
        ) : (
          <LinkHelper
            href="javascript:void(0)"
            children="No Leagues"
            classes={{
              link: classes.link,
              linkAnchor: classNames(classes.nested, classes.linkAnchor),
              text:classes.text
            }}
            Icon={() => ''}
            disabled
          />
        )}
      </Collapse>}

      {(user.loggedIn === false) && <LinkHelper 
        href="/login"
        children="LOGIN"
        classes={{
          link: classes.link,
          linkAnchor: classNames(classes.linkAnchor, {[classes.activeLink]: isActive('/login')}),
          text:classNames(classes.text, {[classes.activeText]: isActive('/login')})
        }}
        Icon={() => ''}
        onClick={hideMobileNav}
      />}

      {(user.loggedIn === false) && <LinkHelper 
        href="/signup"
        children="SIGNUP"
        classes={{
          link: classes.link,
          linkAnchor: classNames(classes.linkAnchor, {[classes.activeLink]: isActive('/signup')}),
          text:classNames(classes.text, {[classes.activeText]: isActive('/signup')})
        }}
        Icon={() => ''}
        onClick={hideMobileNav}
      />}

    </List>
  )
}

function mapStateToProps(state) {
  return {
    user: state.user,
    leagues: state.leagues,
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, {hideMobileNav, clickedLeague}),
)(TopNavHomeVariant)

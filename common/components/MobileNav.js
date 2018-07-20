const R = require('ramda')
import React from 'react'
import {connect} from 'react-redux'
import Link from 'next/link'
import classNames from 'classnames'
import { withRouter } from 'next/router'
import { push as Menu } from 'react-burger-menu'
import {withStyles} from '@material-ui/core/styles'
import {hideMobileNav} from '../actions/status-actions'
import {ToggleContext} from '../providers/ToggleProvider'
import MenuButton from './Navigation/Buttons/MenuButton'

import HomeLogoIcon from './Icons/HomeLogoIcon'
import HomeIcon from '@material-ui/icons/Home'
import PublicIcon from '@material-ui/icons/Public'
import HelpIcon from '@material-ui/icons/Help'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'

const pathnameEqToHref = R.curry((pathname, href) => pathname === href)

const styles = (theme) => (console.log(theme), {
  container: {
    background: theme.palette.primary.main,
    color: 'white',
  },
  logo: {
  },
  link: {
    padding: 10,
    textDecoration: 'none',
    fontWeight: 500,
  },
  activeLink: {
    background: theme.palette.primary.dark,
  },
  nestedContainer: {
    background: theme.palette.primary.A700,
  },
  nested: {
    paddingLeft: 20,
    color: 'white',
  },
  leagueIcon: {
    marginRight: 15,
  }
})

const closeAllMenusOnEsc = (e) => {
  e = e || window.event;
  if (e.key === 'Escape' || e.keyCode === 27) {
    hideMobileNav()
  }
}

const LinkHelper = ({
  children,
  href,
  className,
  Icon,
  endAdornment,
  parent,
  onClick,
}) => (
  <ListItem
    button
    dense
    onClick={parent ? onClick : (() => {})}
  >
    <ListItemIcon>
      <Icon style={{color: 'white'}} />
    </ListItemIcon>
    {parent ? (
      <ListItemText
        inset
        primary={children}
        primaryTypographyProps={{
          variant: 'body1',
          className: className,
          href: href,
          color: 'inherit',
        }}
      />
    ) : (
      <Link>
        <ListItemText
          inset
          primary={children}
          primaryTypographyProps={{
            variant: 'body1',
            className: className,
            href: href,
            color: 'inherit',
            component: 'a',
          }}
        />
      </Link>  
    )}
    {endAdornment}
  </ListItem>
)

const MobileNav = ({
  router,
  classes,
  user,
  isVisible,
  hideMobileNav,
}) => {
  const isActive = pathnameEqToHref(router.pathname)

  return (
    <ToggleContext.Consumer>
      {({toggle, data}) => {
        const league1 = !data.league1

        return (
          <Menu
            isOpen={isVisible}
            className={classes.container}
            outerContainerId="outer-container"
            pageWrapId="page-wrap"
            customBurgerIcon={false}
            customCrossIcon={false}
            customOnKeyDown={closeAllMenusOnEsc}
            disableOverlayClick={hideMobileNav}
          >
            <List>
              <ListItem
                button
              >
                <Link>
                  <a href="/">
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
              className={classNames(classes.link, {[classes.activeLink]: isActive('/')})}
              Icon={HomeIcon}
             />
             <LinkHelper 
              href="/"
              children="Create/Join League"
              className={classNames(classes.link, {[classes.activeLink]: isActive('/')})}
              Icon={PublicIcon}
             />
             <LinkHelper 
              href="/"
              children="Rules & FAQ"
              className={classNames(classes.link, {[classes.activeLink]: isActive('/')})}
              Icon={HelpIcon}
             />
             <LinkHelper 
              href="javascript:void(0)"
              children="League 1"
              endAdornment={league1 ? <ExpandLess /> : <ExpandMore />}
              className={classNames(classes.link, {[classes.activeLink]: isActive('/')})}
              Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>#1</Typography>}
              parent={true}
              onClick={() => toggle('league1')}
             />
            </List>
            <Collapse className={classes.nestedContainer} in={league1}>
              <LinkHelper 
               href="/"
               children="Live Draft"
               className={classNames(classes.nested, classes.link, {[classes.activeLink]: isActive('/')})}
               Icon={() => ""}
              />
              <LinkHelper 
               href="/"
               children="Standings"
               className={classNames(classes.nested, classes.link, {[classes.activeLink]: isActive('/')})}
               Icon={() => ""}
              />
            </Collapse>
          </Menu>
        )
      }}
    </ToggleContext.Consumer>
  )
}

function mapStateToProps(state) {
  return {
    isVisible: state.status.showMobileNav,
    user: state.user,
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, {hideMobileNav}),
)(MobileNav)

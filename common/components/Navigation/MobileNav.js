const R = require('ramda')
import React from 'react'
import {connect} from 'react-redux'
import Link from 'next/link'
import classNames from 'classnames'
import { withRouter } from 'next/router'
import { slide as Menu } from 'react-burger-menu'
import {withStyles} from '@material-ui/core/styles'
import {hideMobileNav} from '../../actions/status-actions'
import {ToggleContext} from '../../providers/ToggleProvider'
import MenuButton from './Buttons/MenuButton'

import HomeLogoIcon from '../Icons/HomeLogoIcon'
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

const styles = (theme) => ({
  container: {
    background: theme.palette.primary.main,
    color: 'white',
  },
  logo: {
  },
  link: {
    '&:hover': {
      color: '#EBAB38',
    },
  },
  linkAnchor: {
    fontSize: '1.1em',
    padding: 10,
    textDecoration: 'none',
    fontWeight: 500,
  },
  activeLink: {
    // background: theme.palette.primary.dark,
    color: '#EBAB38',
  },
  nestedContainer: {
    background: theme.palette.primary.A700,
  },
  nested: {
    paddingLeft: 20,
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
  classes,
  Icon,
  endAdornment,
  parent,
  onClick,
}) => (
  <ListItem
    button
    dense
    onClick={parent ? onClick : (() => {})}
    className={classes.link}
  >
    <ListItemIcon>
      <Icon style={{color: 'inherit'}} />
    </ListItemIcon>
    {parent ? (
      <ListItemText
        inset
        primary={children}
        primaryTypographyProps={{
          variant: 'body1',
          className: classes.linkAnchor,
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
            className: classes.linkAnchor,
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
  variant,
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
              children="DERBY HOME"
              classes={{
                link: classNames(classes.link, {[classes.activeLink]: isActive('/')}),
                linkAnchor: classes.linkAnchor,
              }}
              Icon={HomeIcon}
             />
             <LinkHelper 
              href="/"
              children="CREATE/JOIN LEAGUE"
              classes={{
                link: classNames(classes.link, {[classes.activeLink]: isActive('/participate')}),
                linkAnchor: classes.linkAnchor,
              }}
              Icon={PublicIcon}
             />
             <LinkHelper 
              href="/"
              children="RULES & FAQ"
              classes={{
                link: classNames(classes.link, {[classes.activeLink]: isActive('/faq')}),
                linkAnchor: classes.linkAnchor,
              }}
              Icon={HelpIcon}
             />
             <LinkHelper 
              href="javascript:void(0)"
              children="LEAGUE 1"
              endAdornment={league1 ? <ExpandLess /> : <ExpandMore />}
              classes={{
                link: classNames(classes.link, {[classes.activeLink]: isActive('/scoreboard')}),
                linkAnchor: classes.linkAnchor,
              }}
              Icon={() => <Typography variant="title" color="inherit" className={classes.leagueIcon}>#1</Typography>}
              parent={true}
              onClick={() => toggle('league1')}
             />
            </List>
            <Collapse className={classes.nestedContainer} in={league1}>
              <LinkHelper 
                href="/"
                children="LIVE DRAFT"
                classes={{
                 link: classes.link,
                 linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: isActive('/')}),
                }}
                Icon={() => ""}
              />
              <LinkHelper 
                href="/"
                children="STANDINGS"
                classes={{
                  link: classes.link,
                  linkAnchor: classNames(classes.nested, classes.linkAnchor, {[classes.activeLink]: isActive('/')}),
                }}
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

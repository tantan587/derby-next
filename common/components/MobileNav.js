const R = require('ramda')
import React from 'react'
import {connect} from 'react-redux'
import Link from 'next/link'
import classNames from 'classnames'
import { withRouter } from 'next/router'
import { push as Menu } from 'react-burger-menu'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {hideMobileNav} from '../actions/status-actions'

const pathnameEqToHref = R.curry((pathname, href) => pathname === href)

const styles = (theme) => (console.log(theme), {
  container: {
    background: theme.palette.primary.main,
    color: 'white',
  },
  link: {
    padding: 10,
    textDecoration: 'none',
  },
  activeLink: {
    background: theme.palette.primary.dark,
  }
})

const closeAllMenusOnEsc = (e) => {
  e = e || window.event;
  if (e.key === 'Escape' || e.keyCode === 27) {
    hideMobileNav()
  }
};

const MobileNav = ({
  router,
  classes,
  user,
  isVisible,
  hideMobileNav,
}) => {
  const isActive = pathnameEqToHref(router.pathname)

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
      <Link>
        <Typography
          variant="body1"
          className={classNames(classes.link, {[classes.activeLink]: isActive('/')})}
          href="/"
          color="inherit"
          component="a"
        >
          DERBY HOME
        </Typography>
      </Link>
      <Link>
        <Typography
          variant="body1"
          className={classNames(classes.link, {[classes.activeLink]: isActive('/')})}
          href="/"
          color="inherit"
          component="a"
        >
          CREATE/JOIN LEAGUE
        </Typography>
      </Link>
      <Link>
        <Typography
          variant="body1"
          className={classNames(classes.link, {[classes.activeLink]: isActive('/scoreboard')})}
          href="/scoreboard"
          color="inherit"
          component="a"
        >
          SCOREBOARD
        </Typography>
      </Link>
    </Menu>
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

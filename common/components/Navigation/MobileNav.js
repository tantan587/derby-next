const R = require('ramda')
import {connect} from 'react-redux'
import { withRouter } from 'next/router'
import { slide as Menu } from 'react-burger-menu'
import Swipeable from 'react-swipeable'
import {withStyles} from '@material-ui/core/styles'
import {hideMobileNav} from '../../actions/status-actions'
import {ToggleContext} from '../../providers/ToggleProvider'

const styles = (theme) => ({
  container: {
    background: theme.palette.primary.main,
    color: 'white',
  },
})

const closeAllMenusOnEsc = (e) => {
  e = e || window.event
  if (e.key === 'Escape' || e.keyCode === 27) {
    hideMobileNav()
  }
}

const Variants = {
  'TopNavHomeVariant': require('./Variants/TopNavHomeVariant').default,
  'TopNavLeagueVariant': require('./Variants/TopNavLeagueVariant').default,
}

class SwipeComponent extends React.Component {

  swiped = (e, deltaX, deltaY, isFlick, velocity) => {
    // console.log("You Swiped...", e, deltaX, deltaY, isFlick, velocity)
    if (deltaX > 90 && velocity > 0.25) {
      this.props.onCloseNav()
    }
  }

  render() {
    return (
      <Swipeable
        onSwiped={this.swiped}
      >
        {this.props.children}
      </Swipeable>
    )
  }
}

const MobileNav = ({
  classes,
  isVisible,
  hideMobileNav,
  variant,
}) => {
  const Variant = Variants[variant]
  return (
    <ToggleContext.Consumer>
      {({toggle, data}) => {
        return (
          <SwipeComponent onCloseNav={hideMobileNav}>
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
              {Variant && <Variant
                toggle={toggle}
                toggleData={data}
              />}
            </Menu>
          </SwipeComponent>
        )
      }}
    </ToggleContext.Consumer>
  )
}

function mapStateToProps(state) {
  return {
    isVisible: state.status.showMobileNav,
    variant: state.status.variant,
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, {hideMobileNav}),
)(MobileNav)

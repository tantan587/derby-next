import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Router from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress'
import {handleForceLogin} from '../actions/auth-actions'
import { withStyles } from '@material-ui/core/styles'


const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.secondary[700],
    left:'50%',
    top:'30%',
    marginLeft:-25,
    marginTop:-25,
    position: 'absolute',
  },
})


class RouteProtector extends React.Component {

  constructor(props, context) {
    super(props, context)
  }

  render () {

    const {ProtectedRoute, user, status, classes, checkCommish} = this.props
    console.log('hello', this.props)
    if(!status.loaded) {
      return(<div style={{height:1000}}><CircularProgress className={classes.progress} size={50} /></div>)
    }

    else {
      if (Object.keys(user).length === 0 ||
        user.loggedIn === false ||
        (checkCommish && !this.props.activeLeague.imTheCommish)) {

        if (typeof document !== 'undefined'){
          this.props.updateForceLogin(this.props.previousPage)
          Router.push('/redirectlogin')
        }

        return(null)
      }
      console.log('route', user)
      // Pass the received 'props' and created functions to the ProtectedRoute component
      return (
        <ProtectedRoute/>
      )
    }
  }
}

RouteProtector.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(
  state =>
    ({
      status : state.status,
      user : state.user,
      activeLeague:state.activeLeague
    }),
  dispatch =>
    ({
      updateForceLogin(previousPage) {
        dispatch(
          handleForceLogin(previousPage))
      }
    }))(withStyles(styles)(RouteProtector))

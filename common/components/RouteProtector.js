import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Router from 'next/router'
import {handleForceLogin} from '../actions/auth-actions'

class RouteProtector extends React.Component {

  constructor(props, context) {
    super(props, context)
  }

  render () {

    const {ProtectedRoute} = this.props

    if(this.props.user.loggedIn === false){
      if (typeof document !== 'undefined'){
        this.props.updateForceLogin(this.props.previousPage)
        Router.push('/redirectlogin')
      }
      return(<div></div>)
    }
    // Pass the received 'props' and created functions to the ProtectedRoute component
    return (
      <ProtectedRoute/>
    )
  }
}

RouteProtector.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(
  state =>
    ({
      user : state.user
    }),
  dispatch =>
    ({
      updateForceLogin(previousPage) {
        dispatch(
          handleForceLogin(previousPage))
      }
    }))(RouteProtector)
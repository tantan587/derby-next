const R = require('ramda')
import React from 'react'
import {withRouter} from 'next/router'
import LayoutUser from '../common/components/LayoutUser'
import JoinLeagueFlow from '../common/components/Participate/JoinLeagueFlow'
import RouteProtector from '../common/components/RouteProtector'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class JoinLeague extends React.Component {
  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector 
            ProtectedRoute={() => <JoinLeagueFlow/>}
            previousPage={'joinleague'}/>
        </LayoutUser>
      </div>
    )
  }
}

export default R.compose(
  withRedux(storeFactory),
  withRouter,
  withRoot,
)(JoinLeague)
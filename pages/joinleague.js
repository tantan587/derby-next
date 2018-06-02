import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import JoinLeagueForm from '../common/components/JoinLeagueForm'
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
            ProtectedRoute={() => <JoinLeagueForm/>}
            previousPage={'joinleague'}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(JoinLeague))
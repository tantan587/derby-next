import React from 'react'
import LayoutUser from '../common/components/LayoutUser' 
import CreateLeagueFlow from '../common/components/Participate/CreateLeagueFlow'
import RouteProtector from '../common/components/RouteProtector'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class CreateLeague extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector 
            ProtectedRoute={() => <CreateLeagueFlow/>}
            previousPage={'createleague'}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(CreateLeague))
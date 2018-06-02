import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import RouteProtector from '../common/components/RouteProtector'
import LogoutForm from '../common/components/LogoutForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class Logout extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector 
            ProtectedRoute={() => <LogoutForm/>}
            previousPage={'logout'}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Logout))
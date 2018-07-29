import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import ParticipateForm from '../common/components/Participate/ParticipateForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import RouteProtector from '../common/components/RouteProtector'

class Participate extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector 
            ProtectedRoute={() => 
              <ParticipateForm />}
            previousPage={'participate'}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Participate))
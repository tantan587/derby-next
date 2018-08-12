import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import LegalPage from '../common/components/CopyPages/Legal'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import RouteProtector from '../common/components/RouteProtector'

// const LegalPage = () => <div>I am rules</div>

class Rules extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector
            ProtectedRoute={() =>
              <LegalPage />}
            previousPage={'rles'}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Rules))

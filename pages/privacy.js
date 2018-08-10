import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import PrivacyPage from '../common/components/CopyPages/Privacy'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import RouteProtector from '../common/components/RouteProtector'

// const PrivacyPage = () => <div>I am rules</div>

class Rules extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector
            ProtectedRoute={() =>
              <PrivacyPage />}
            previousPage={'rles'}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Rules))

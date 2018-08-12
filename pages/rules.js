import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import RulesPage from '../common/components/CopyPages/Rules'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import RouteProtector from '../common/components/RouteProtector'

// const RulesPage = () => <div>I am rules</div>

class Rules extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector
            ProtectedRoute={() =>
              <RulesPage />}
            previousPage={'rles'}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Rules))

import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import DraftRecapPage from '../common/components/Draft/RelatedPages/DraftRecapPage'
import RouteProtector from '../common/components/RouteProtector'


class DraftRecap extends React.Component {

  render() {
    return (
      <div>
        <LayoutLeague>
          <RouteProtector
            ProtectedRoute={() =>
              <DraftRecapPage />}
            previousPage={'draftrecap'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(DraftRecap))

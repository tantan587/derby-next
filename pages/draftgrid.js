import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import DraftGridPage from '../common/components/Draft/RelatedPages/DraftGridPage'
import RouteProtector from '../common/components/RouteProtector'


class DraftGrid extends React.Component {

  render() {
    return (
      <div>
        <LayoutLeague>
          <RouteProtector
            ProtectedRoute={() =>
              <DraftGridPage />}
            previousPage={'draftgrid'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(DraftGrid))

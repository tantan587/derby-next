import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import RouteProtector from '../common/components/RouteProtector'
import DraftContainer from '../common/components/Draft/DraftContainer'


class LiveDraft extends React.Component {

  
  render() {
    return (
      <div>
        <LayoutLeague >
          <RouteProtector 
            ProtectedRoute={() => 
              <DraftContainer/>}
            previousPage={'livedraft'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(LiveDraft))
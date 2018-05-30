import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import MainLeagueLayout from '../common/components/MainLeague/MainLeagueLayout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import RouteProtector from '../common/components/RouteProtector'
import DraftContainer from '../common/components/Draft/DraftContainer'


class LiveDraft extends React.Component {

  
  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueLayout value={8}>
                <DraftContainer/>
              </MainLeagueLayout>}
            previousPage={'livedraft'}/>
        </LayoutUser>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(LiveDraft))
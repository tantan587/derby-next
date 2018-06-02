import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import MainLeagueLayout from '../common/components/MainLeague/MainLeagueLayout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import AddOfflineDraftForm from '../common/components/MainLeague/AddOfflineDraftForm'
import RouteProtector from '../common/components/RouteProtector'


class AddDraft extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueLayout value={7}>
                <AddOfflineDraftForm/>
              </MainLeagueLayout>}
            previousPage={'add-draft'}/>
        </LayoutUser>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(AddDraft))
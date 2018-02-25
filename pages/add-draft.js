import React from 'react'
import Layout from '../common/components/Layout'
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
        <Layout >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueLayout value={7}>
                <AddOfflineDraftForm/>
              </MainLeagueLayout>}
            previousPage={'add-draft'}/>
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(AddDraft))
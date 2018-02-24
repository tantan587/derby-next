import React from 'react'
import Layout from '../common/components/Layout'
import MainLeagueLayout from '../common/components/MainLeague/MainLeagueLayout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import AddOfflineDraftForm from '../common/components/MainLeague/AddOfflineDraftForm'


class AddDraft extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <MainLeagueLayout value={7}>
            <AddOfflineDraftForm/>
          </MainLeagueLayout>
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(AddDraft))
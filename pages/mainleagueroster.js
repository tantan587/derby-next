import React from 'react'
import Layout from '../common/components/Layout'
import MainLeagueLayout from '../common/components/MainLeague/MainLeagueLayout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueRoster from '../common/components/MainLeague/MainLeagueRoster'


class Roster extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <MainLeagueLayout value={2}>
            <MainLeagueRoster/>
          </MainLeagueLayout>
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Roster))
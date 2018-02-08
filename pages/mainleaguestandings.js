import React from 'react'
import Layout from '../common/components/Layout'
import MainLeagueLayout from '../common/components/MainLeagueLayout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueStandingsTable from '../common/components/MainLeagueStandingsTable'


class MainLeagueStandings extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <MainLeagueLayout>
            <MainLeagueStandingsTable/>
          </MainLeagueLayout>
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(MainLeagueStandings))
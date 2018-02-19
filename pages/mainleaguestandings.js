import React from 'react'
import Layout from '../common/components/Layout'
import MainLeagueLayout from '../common/components/MainLeague/MainLeagueLayout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueStandings from '../common/components/MainLeague/MainLeagueStandings'


class Standings extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <MainLeagueLayout value={0}>
            <MainLeagueStandings />
          </MainLeagueLayout>
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Standings))
import React from 'react'
import Layout from '../common/components/Layout'
import MainLeagueLayout from '../common/components/MainLeague/MainLeagueLayout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueTeams from '../common/components/MainLeague/MainLeagueTeams'
import RouteProtector from '../common/components/RouteProtector'


class Teams extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueLayout value={3}>
                <MainLeagueTeams />
              </MainLeagueLayout>}
            previousPage={'mainleagueteams'}/>
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Teams))
import React from 'react'
import Layout from '../common/components/Layout'
import MainLeagueLayout from '../common/components/MainLeague/MainLeagueLayout'
import RouteProtector from '../common/components/RouteProtector'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueSchedule from '../common/components/MainLeague/MainLeagueSchedule'


class Schedule extends React.Component {

  render() {

    const page = () => 
      <MainLeagueLayout value={1}>
        <MainLeagueSchedule/>
      </MainLeagueLayout>

    return (
      <div>
        <Layout >
          <RouteProtector 
            ProtectedRoute={page}
            previousPage={'mainleagueschedule'}/>
          {/* <LogoutForm /> */}
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Schedule))
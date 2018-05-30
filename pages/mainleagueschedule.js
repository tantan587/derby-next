import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import MainLeagueLayout from '../common/components/MainLeague/MainLeagueLayout'
import RouteProtector from '../common/components/RouteProtector'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueSchedule from '../common/components/MainLeague/MainLeagueSchedule'


class Schedule extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueLayout value={1}>
                <MainLeagueSchedule/>
              </MainLeagueLayout>}
            previousPage={'mainleagueschedule'}/>
        </LayoutUser>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Schedule))
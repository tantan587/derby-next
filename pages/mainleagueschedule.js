import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import RouteProtector from '../common/components/RouteProtector'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueSchedule from '../common/components/MainLeague/MainLeagueSchedule'


class Schedule extends React.Component {

  render() {
    return (
      <div>
        <LayoutLeague >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueSchedule/>}
            previousPage={'mainleagueschedule'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Schedule))
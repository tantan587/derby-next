import React from 'react'
import LayoutLeague from '../common/components/LayoutUser'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import RouteProtector from '../common/components/RouteProtector'
import MainLeagueRoster from '../common/components/MainLeague/MainLeagueRoster'


class Roster extends React.Component {

  
  render() {
    return (
      <div>
        <LayoutLeague >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueRoster/>}
            previousPage={'mainleagueroster'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Roster))
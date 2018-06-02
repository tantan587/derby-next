import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueHome from '../common/components/MainLeague/MainLeagueHome'
import RouteProtector from '../common/components/RouteProtector'


class LeagueHome extends React.Component {

  render() {
    return (
      <div>
        <LayoutLeague>
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueHome />}
            previousPage={'mainleaguehome'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(LeagueHome))
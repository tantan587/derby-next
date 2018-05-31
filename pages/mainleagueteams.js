import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueTeams from '../common/components/MainLeague/MainLeagueTeams'
import RouteProtector from '../common/components/RouteProtector'


class Teams extends React.Component {

  render() {
    return (
      <div>
        <LayoutLeague >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueTeams />}
            previousPage={'mainleagueteams'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Teams))
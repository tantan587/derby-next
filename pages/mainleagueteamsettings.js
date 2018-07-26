import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueTeamSettings from '../common/components/MainLeague/MainLeagueTeamSettings'
import RouteProtector from '../common/components/RouteProtector'


class Standings extends React.Component {

  render() {
    return (
      <div>
        <LayoutLeague >
          <RouteProtector
            ProtectedRoute={() =>
              <MainLeagueTeamSettings />}
            previousPage={'mainleagueteamsettings'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Standings))

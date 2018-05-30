import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
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
        <LayoutUser >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueLayout value={3}>
                <MainLeagueTeams />
              </MainLeagueLayout>}
            previousPage={'mainleagueteams'}/>
        </LayoutUser>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Teams))
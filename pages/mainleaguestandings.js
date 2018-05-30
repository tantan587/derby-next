import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import MainLeagueLayout from '../common/components/MainLeague/MainLeagueLayout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueStandings from '../common/components/MainLeague/MainLeagueStandings'
import RouteProtector from '../common/components/RouteProtector'


class Standings extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueLayout value={0}>
                <MainLeagueStandings />
              </MainLeagueLayout>}
            previousPage={'mainleaguestandings'}/>
        </LayoutUser>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Standings))
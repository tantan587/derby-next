import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import MainLeagueStandings from '../common/components/MainLeague/MainLeagueStandings'
import RouteProtector from '../common/components/RouteProtector'


class Standings extends React.Component {

  render() {
    return (
      <div>
        <LayoutLeague >
          <RouteProtector 
            ProtectedRoute={() => 
              <MainLeagueStandings />}
            previousPage={'mainleaguestandings'}/>
        </LayoutLeague>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(Standings))
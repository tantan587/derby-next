import React from 'react'
import LayoutLeague from '../common/components/LayoutLeague'
import ScoreboardPage from '../common/components/Scoreboard/ScoreboardPage'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import RouteProtector from '../common/components/RouteProtector'


class Scoreboard extends React.Component {
  
  render() {
    return (
      <div>
        <LayoutLeague >
          <RouteProtector
            ProtectedRoute={() =>
              <ScoreboardPage />}
            previousPage={'mainleaguescoreboard'}/>
        </LayoutLeague>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Scoreboard))
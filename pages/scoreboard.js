import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import ScoreboardPageHome from '../common/components/Scoreboard/ScoreboardPageHome'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'

class Scoreboard extends React.Component {
  render() {
    return (
      <div>
        <LayoutUser >
          <ReloadProtector 
            ProtectedRoute={() => 
              <ScoreboardPageHome redirectInd={true}/>} />
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Scoreboard))
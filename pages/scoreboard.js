import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import ScoreboardPage from '../common/components/Scoreboard/ScoreboardPage'
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
              <ScoreboardPage redirectInd={true}/>} />
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Scoreboard))
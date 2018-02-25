import React from 'react'
import Layout from '../common/components/Layout'
import JoinLeagueForm from '../common/components/JoinLeagueForm'
import RouteProtector from '../common/components/RouteProtector'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class JoinLeague extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <RouteProtector 
            ProtectedRoute={() => <JoinLeagueForm/>}
            previousPage={'joinleague'}/>
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(JoinLeague))
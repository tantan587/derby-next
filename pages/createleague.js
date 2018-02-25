import React from 'react'
import Layout from '../common/components/Layout'
import CreateLeagueForm from '../common/components/CreateLeagueForm'
import RouteProtector from '../common/components/RouteProtector'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class CreateLeague extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <RouteProtector 
            ProtectedRoute={() => <CreateLeagueForm/>}
            previousPage={'createleague'}/>
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(CreateLeague))
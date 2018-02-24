import React from 'react'
import Layout from '../common/components/Layout'
import RouteProtector from '../common/components/RouteProtector'
import LogoutForm from '../common/components/LogoutForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class Logout extends React.Component {

  render() {
    const page = () => <LogoutForm/>
    return (
      <div>
        <Layout >
          <RouteProtector 
            ProtectedRoute={page}
            previousPage={'logout'}/>
          {/* <LogoutForm /> */}
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Logout))
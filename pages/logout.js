import React from 'react'
import Layout from '../common/components/Layout'
import LogoutForm from '../common/components/LogoutForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class Logout extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <LogoutForm />
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Logout))
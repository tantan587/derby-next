import React from 'react'
import Layout from '../common/components/Layout'
import ForgotPasswordForm from '../common/components/ForgotPasswordForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class ForgotPassword extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <ForgotPasswordForm />
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(ForgotPassword))
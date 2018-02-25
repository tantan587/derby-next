import React from 'react'
import Layout from '../common/components/Layout'
import ForgotPasswordForm from '../common/components/ForgotPasswordForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'

class ForgotPassword extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <ReloadProtector 
            ProtectedRoute={() => 
              <ForgotPasswordForm/>}/>
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(ForgotPassword))
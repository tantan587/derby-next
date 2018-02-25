import React from 'react'
import Layout from '../common/components/Layout'
import SignupForm from '../common/components/SignupForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'

class Signup extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <ReloadProtector 
            ProtectedRoute={() => 
              <SignupForm redirectInd={true}/>}/>
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Signup))
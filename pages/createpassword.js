import React from 'react'
import Layout from '../common/components/Layout'
import CreatePasswordForm from '../common/components/CreatePasswordForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'

class CreatePassword extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <ReloadProtector 
            ProtectedRoute={() => 
              <CreatePasswordForm/>}/>
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(CreatePassword))
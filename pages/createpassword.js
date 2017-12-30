import React from 'react'
import Layout from '../common/components/Layout'
import CreatePasswordForm from '../common/components/CreatePasswordForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class CreatePassword extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <CreatePasswordForm />
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(CreatePassword))
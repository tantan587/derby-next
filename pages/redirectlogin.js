import React from 'react'
import Layout from '../common/components/Layout'
import LoginForm from '../common/components/LoginForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'


class RedirectLogin extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <LoginForm redirectInd={true}/>
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(RedirectLogin))
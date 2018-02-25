import React from 'react'
import Layout from '../common/components/Layout'
import LoginForm from '../common/components/LoginForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import initStore from '../common/store'


class Login extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <LoginForm redirectInd={false}/>
        </Layout>
      </div>
    )
  }
}
export default withRedux(initStore, null, null)(withRoot(Login))
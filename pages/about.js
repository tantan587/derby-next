import React from 'react'
import Layout from '../common/components/Layout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class About extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <p>This is about</p>
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(About))
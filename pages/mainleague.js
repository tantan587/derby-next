import React from 'react'
import Layout from '../common/components/Layout'
import MainLeaguePage from '../common/components/MainLeaguePage'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'


class MainLeague extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <MainLeaguePage />
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(MainLeague))
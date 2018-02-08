import React from 'react'
import Layout from '../common/components/Layout'
import MainLeagueLayout from '../common/components/MainLeagueLayout'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class MainLeagueWelcome2 extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <MainLeagueLayout>
            <div>
              Welcome21
            </div>
          </MainLeagueLayout>
        </Layout>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(MainLeagueWelcome2))
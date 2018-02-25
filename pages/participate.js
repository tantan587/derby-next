import React from 'react'
import Layout from '../common/components/Layout'
import ParticipateForm from '../common/components/ParticipateForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import RouteProtector from '../common/components/RouteProtector'

class Participate extends React.Component {

  render() {
    return (
      <div>
        <Layout >
          <RouteProtector 
            ProtectedRoute={() => 
              <ParticipateForm />}
            previousPage={'participate'}/>
        </Layout>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Participate))
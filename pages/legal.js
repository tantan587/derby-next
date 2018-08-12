import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import LegalPage from '../common/components/CopyPages/Legal'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class Legal extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <LegalPage/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Legal))

import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

class About extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <p>This is about</p>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(About))
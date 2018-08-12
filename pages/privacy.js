import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import PrivacyPage from '../common/components/CopyPages/Privacy'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

// const PrivacyPage = () => <div>I am rules</div>

class Privacy extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <PrivacyPage/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Privacy))

import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import PreviewPage from '../common/components/PreviewPage1'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

// const PrivacyPage = () => <div>I am rules</div>

class Preview extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <PreviewPage/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Preview))
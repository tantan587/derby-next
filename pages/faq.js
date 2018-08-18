import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import FAQPage from '../common/components/CopyPages/FAQ'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'

// const RulesPage = () => <div>I am rules</div>

class FAQ extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <FAQPage/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(FAQ))

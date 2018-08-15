import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import EmailVerification from '../common/components/UserPages/EmailVerification'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'

class EmailVerificationPage extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <ReloadProtector 
            ProtectedRoute={() => 
              <EmailVerification url={this.props.url}/>}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(EmailVerificationPage))
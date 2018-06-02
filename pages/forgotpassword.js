import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import ForgotPasswordForm from '../common/components/ForgotPasswordForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'

class ForgotPassword extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <ReloadProtector 
            ProtectedRoute={() => 
              <ForgotPasswordForm/>}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(ForgotPassword))
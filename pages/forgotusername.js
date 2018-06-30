import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import ForgotUsernameForm from '../common/components/ForgotUsernameForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'

class ForgotUsername extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <ReloadProtector 
            ProtectedRoute={() => 
              <ForgotUsernameForm/>}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(ForgotUsername))
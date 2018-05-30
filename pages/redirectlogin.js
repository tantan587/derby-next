import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import LoginForm from '../common/components/LoginForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'


class RedirectLogin extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <ReloadProtector 
            ProtectedRoute={() => 
              <LoginForm redirectInd={true}/>}/>
        </LayoutUser>
      </div>
    )
  }
}
export default withRedux(storeFactory)(withRoot(RedirectLogin))
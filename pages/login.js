import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import LoginForm from '../common/components/LoginForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import initStore from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'

class Login extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <ReloadProtector 
            ProtectedRoute={() => 
              <LoginForm redirectInd={false}/>}/>
        </LayoutUser>
      </div>
    )
  }
}
export default withRedux(initStore, null, null)(withRoot(Login))
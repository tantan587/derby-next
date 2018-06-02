import React from 'react'
import LayoutUser from '../common/components/LayoutUser'
import SignupForm from '../common/components/SignupForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'

class Signup extends React.Component {

  render() {
    return (
      <div>
        <LayoutUser >
          <ReloadProtector 
            ProtectedRoute={() => 
              <SignupForm redirectInd={true}/>}/>
        </LayoutUser>
      </div>
    )
  }
}

export default withRedux(storeFactory)(withRoot(Signup))
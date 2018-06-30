const R = require('ramda') 
import React, {Component} from 'react'
import autobind from 'react-autobind'
import LayoutUser from '../common/components/LayoutUser'
import LoginForm from '../common/components/LoginForm'
import withRoot from '../common/components/withRoot'
import withRedux from 'next-redux-wrapper'
import initStore from '../common/store'
import ReloadProtector from '../common/components/ReloadProtector'
import withSnackbar from '../common/components/withSnackbar'

class Login extends Component {
  constructor(props) {
    super(props)
    autobind(this)
  }

  renderComponent() {
    return (
      <LoginForm
        redirectInd={false}
      />
    )
  }

  render() {
    return (
      <LayoutUser>
        <ReloadProtector 
          ProtectedRoute={this.renderComponent}
        />
      </LayoutUser>
    )
  }
}

export default R.compose(
  withRedux(initStore),
  withRoot,
  withSnackbar,
)(Login)
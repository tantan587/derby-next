import React from 'react'
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import storeFactory from '../store'
import { Provider } from 'react-redux'
import ToggleProvider from '../providers/ToggleProvider'

const store = storeFactory(false)


function withRoot(Component) {
  class WithRoot extends React.Component {

    render() {
      return (
  
        <Provider store={store}>
          <ToggleProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Component {...this.props} />
            </MuiPickersUtilsProvider>
          </ToggleProvider>
        </Provider>
      )
    }
  }


  return WithRoot
}

export default withRoot
import {Component} from 'react'
import autobind from 'react-autobind'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import {SB} from '../constants'

function WithSnackbar(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props)
      autobind(this)
      this.state = {message: props.router && SB[props.router.query.SB] || '', visible: true}
    }

    hideSnackbar() {
      this.setState({visible: false})
    }

    render() {
      const message = this.state.message
      return message.length 
        ? [
          <WrappedComponent key="WB" {...this.props} />,
          <Snackbar
            key="SB"
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            open={this.state.visible}
            autoHideDuration={6000}
            message={message}
            action={(
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.hideSnackbar}
              >
                <CloseIcon />
              </IconButton>
            )}
          />
        ] : <WrappedComponent {...this.props} />
    }
  } 
}

export default WithSnackbar
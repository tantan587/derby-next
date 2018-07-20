//const R = require('ramda')
import {Component, createContext} from 'react'

export const ToggleContext = createContext()

class ToggleProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      toggle: this.toggle.bind(this),
    }
  }
  toggle(key) {
    this.setState({data: {
      ...this.state.data,
      [key]: !(this.state.data[key] === undefined ? false : this.state.data[key]),
    }})
  }
  render() {
    return (
      <ToggleContext.Provider
        value={this.state}
        {...this.props}
      />
    )
  }
}

export default ToggleProvider

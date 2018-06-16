import React, { PureComponent } from 'react'

class CountDown extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      id: setInterval(this.tick.bind(this), 1000),
      timeLeft: props.timeLeft,
    }
  }
  
  tick() {
    const { timeLeft } = this.state
    timeLeft 
    ? this.setState({timeLeft: this.state.timeLeft - 1})
    : this.props.onFinish()
  }

  componentWillUnmount() {
    clearInterval(this.state.id)    
  }

  render () {
    const tot = this.state.timeLeft/60
    const min = Math.floor(tot)
    const sec = Math.floor((tot-min) * 60)
    return `${JSON.stringify(min).padStart(2, '0')}:${JSON.stringify(sec).padStart(2, '0')}`
  }
}

export default CountDown
import React from 'react'
import { connect } from 'react-redux'

const ConnectedCell = ({ n }) =>
  <div>
    {console.log(n)}
    Hello Cell!
  </div>

export default connect()(ConnectedCell)

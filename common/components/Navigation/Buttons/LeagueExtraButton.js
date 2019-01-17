import React from 'react'
import {clickedLeague} from '../../../actions/fantasy-actions'
import { connect } from 'react-redux'
import MenuBase from './MenuBase'
const R = require('ramda')


class LeaguesExtraButton extends React.Component {

  render() {
    const { color, backgroundColor, name, items } = this.props

    return (
      <MenuBase
        color={color}
        backgroundColor={backgroundColor}
        items={items}
        title={name}/>
    )
  }
}


export default R.compose(
  connect(R.pick(['activeLeague']), {onClickedLeague: clickedLeague})
)(LeaguesExtraButton)

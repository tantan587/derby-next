import React from 'react'
import {clickedLeague} from '../../../actions/fantasy-actions'
import { connect } from 'react-redux'
import MenuBase from './MenuBase'
const R = require('ramda')


class LeaguesExtraButton extends React.Component {

  render() {
    const { color, backgroundColor, name } = this.props
    
    const items = [
      {
        text:'League Home',
        link:'/mainleaguehome'},
      {
        text:'Draft Room',
        link:'/livedraft'},
      {
        text:'Team Settings',
        link:'/mainleagueteamsettings'},{
        text:'Commish Tools',
        link:'/mainleaguesettings'}]

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
  connect(R.pick(['activeLeague', 'leagues', 'user']), {onClickedLeague: clickedLeague})
)(LeaguesExtraButton)
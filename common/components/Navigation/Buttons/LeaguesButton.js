import React from 'react'
import {clickedLeague} from '../../../actions/fantasy-actions'
import { connect } from 'react-redux'
import MenuBase from './MenuBase'
const R = require('ramda')


class LeaguesButton extends React.Component {
  handleClick = (league_id) => {
    const { onClickedLeague } = this.props
    console.log(league_id)
    onClickedLeague(league_id || this.props.activeLeague.league_id, this.props.user.id)
  };
  render() {
    const { color, backgroundColor, leagues, useItems2 } = this.props
    const items = leagues.map(league => { 
      return {
        text:league.league_name,
        id:league.league_id,
        link:'/mainleaguehome'} })

    const items2 = []
    items2.push({
      text:'Draft Room',
      link:'/livedraft'})
    items2.push({
      text:'Team Settings',
      link:'/mainleagueteamsettings'})
    items2.push({
      text:'Commish Tools',
      link:'/mainleaguesettings'})

    return (
      <MenuBase
        color={color}
        backgroundColor={backgroundColor}
        items={items}
        extraItems={useItems2 ? items2 : null}
        handleClick={this.handleClick} 
        title='Other'/>
    )
  }
}
// export default connect(({ user, leagues, activeLeague }) => ({ user, leagues, activeLeague }),
//   dispatch =>
//     ({
//       onClickedLeague(league_id, user_id) {
//         dispatch(
//           clickedLeague(league_id, user_id))
//       },
//     }))(LeaguesButton)

export default R.compose(
  connect(R.pick(['activeLeague', 'leagues', 'user']), {onClickedLeague: clickedLeague})
)(LeaguesButton)
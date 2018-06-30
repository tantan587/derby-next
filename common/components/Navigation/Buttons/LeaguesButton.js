import React from 'react'
import {clickedLeague} from '../../../actions/fantasy-actions'
import {clickedSportLeagues} from '../../../actions/sport-actions'
import { connect } from 'react-redux'
import MenuBase from './MenuBase'


class LeaguesButton extends React.Component {
  handleClick = (league_id) => {
    const { onClickedLeague, onSportLeagues } = this.props
    onClickedLeague(league_id, this.props.user.id)
    onSportLeagues(league_id)
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
      text:'League Home',
      link:'/mainleaguehome'})
    items2.push({
      text:'Draft Room',
      link:'/livedraft'})

    items2.push({
      text:'Message Board',
      link:'/livedraft'})    
    items2.push({
      text:'News',
      link:'/livedraft'})
    items2.push({
      text:'League Settings',
      link:'/livedraft'})
    items2.push({
      text:'Commish Tools',
      link:'/livedraft'})

    return (
      <MenuBase
        color={color}
        backgroundColor={backgroundColor}
        items={items}
        extraItems={useItems2 ? items2 : null}
        handleClick={this.handleClick} 
        title='My Leagues'/>
    )
  }
}
export default connect(({ user, leagues }) => ({ user, leagues }),
  dispatch =>
    ({
      onClickedLeague(league_id, user_id) {
        dispatch(
          clickedLeague(league_id, user_id))
      },
      onSportLeagues(league_id) {
        dispatch(
          clickedSportLeagues(league_id))
      },
    }))(LeaguesButton)
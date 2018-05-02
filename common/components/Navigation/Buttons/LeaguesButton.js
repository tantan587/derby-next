import React from 'react'
import {clickedLeague} from '../../../actions/fantasy-actions'
import {clickedStandings, clickedSportLeagues} from '../../../actions/sport-actions'
import { connect } from 'react-redux'
import MenuBase from './MenuBase'


class LeaguesButton extends React.Component {
  handleClick = (league_id) => {
    const { onClickedLeague, onStandings, onSportLeagues } = this.props
    onClickedLeague(league_id, this.props.user.id)
    onStandings(league_id)
    onSportLeagues(league_id)
  };
  render() {
    const { color, backgroundColor, leagues } = this.props
    const items = leagues.map(league => { 
      return {
        text:league.league_name,
        id:league.league_id,
        link:'/mainleaguestandings'} })

    return (
      <MenuBase
        color={color}
        backgroundColor={backgroundColor}
        items={items} 
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
      onStandings(league_id) {
        dispatch(
          clickedStandings(league_id))
      },
      onSportLeagues(league_id) {
        dispatch(
          clickedSportLeagues(league_id))
      },
    }))(LeaguesButton)
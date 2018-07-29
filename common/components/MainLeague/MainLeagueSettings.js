import React from 'react'
import { connect } from 'react-redux'

import Title from '../Navigation/Title'
import LeagueSettings from '../LeagueSettings/LeagueSettings'

class MainLeagueSettings extends React.Component {

  render () {
    const { activeLeague } = this.props

    return (
      <div>
        <Title
          backgroundColor="#EBAB38"
          color="white"
          title="Commish Tools"
          subheading={activeLeague.league_name}
        />
        <LeagueSettings />
      </div>
    )
  }
}
export default connect(state => ({
  activeLeague: state.activeLeague,
  teams: state.teams,
  schedules: state.schedules
}))(MainLeagueSettings)

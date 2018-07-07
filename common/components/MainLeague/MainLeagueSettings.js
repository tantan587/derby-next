import React from 'react'
import { connect } from 'react-redux'

import Title from '../Navigation/Title'
import TeamSettings from '../TeamSettings/TeamSettings'

class MainLeagueSettings extends React.Component {

  render () {
    const { activeLeague } = this.props

    return (
      <div>
        <Title
          backgroundColor="#EBAB38"
          color="white"
          title="Welcome"
          subheading={activeLeague.league_name}
        />
        <TeamSettings />
        <br/>
        <br/>
        <br/>
      </div>
    )
  }
}
export default connect(state => ({
  activeLeague: state.activeLeague,
  teams: state.teams,
  schedules: state.schedules
}))(MainLeagueSettings)

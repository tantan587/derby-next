import React from 'react'
import { connect } from 'react-redux'
import C from '../../constants'
import Title from '../Navigation/Title'
import LeagueSettings from '../LeagueSettings/LeagueSettings'
import { Typography } from '@material-ui/core';

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
        {
          this.props.activeLeague.draftInfo.mode === C.DRAFT_STATE.PRE ?
            <LeagueSettings /> :
            <div style={{height:500}}>
              <div style={{
                marginTop:100,display:'flex', alignItems:'center', flexDirection:'column'}}>
                {this.props.activeLeague.draftInfo.mode === C.DRAFT_STATE.POST ?
                  <Typography style={{ textAlign:'center'}}  variant='display1'>Current season is underway.</Typography> :
                  <Typography style={{ textAlign:'center'}}  variant='display1'>Draft Is Live.</Typography>
                }
                <Typography style={{marginTop:50, textAlign:'center'}} variant='display1'>Changes are no longer allowed.</Typography> 
              </div>
            </div>

        }
        
      </div>
    )
  }
}
export default connect(state => ({
  activeLeague: state.activeLeague,
  teams: state.teams,
  schedules: state.schedules
}))(MainLeagueSettings)

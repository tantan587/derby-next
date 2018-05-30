import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  value: {
    fontWeight: 600,
    fontSize: 18,
  },
  key: {
    fontWeight: 500,
    fontSize: 12,
    color: 'grey',
  }
}

const DialogHead = ({ currTeam, data, oneTeam, classes }) =>
  <div style={{ display: 'flex', width: 550, margin: '35px 0px 35px 35px', justifyContent: 'space-around' }}>
    <img
      style={{ height: 100, width: 100 }}
      src={currTeam.logo_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Chicago_Cubs_logo.svg/99px-Chicago_Cubs_logo.svg.png'}
    />
    <div>
      <div style={{
        fontFamily: '\'Roboto\', sans-serif',
        fontSize: 26,
        fontWeight: 700,
        color: '#48311A',
      }}>
        {oneTeam.team_name || 'Chicago Cubs'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: 350 }}>
        <div>
          <div className={classes.value}>
            {oneTeam.owner || 'XXX'} <span className={classes.key}>Owner</span>
          </div>
          <div className={classes.value}>
            {oneTeam.owned_in_derby_leagues || 'XXX'} <span className={classes.key}>Owned in Derby Leagues</span>
          </div>
          <div className={classes.value}>
            {oneTeam.rank_in_league || 'XXX'} <span className={classes.key}>MLB NL Rank</span>
          </div>
        </div>
        <div>
          <div className={classes.value}>
            {oneTeam.record || 'XXX'} <span className={classes.key}>Record</span>
          </div>
          <div className={classes.value}>
            {oneTeam.curr_points || 'XXX'} <span className={classes.key}>Current Points</span>
          </div>
          <div className={classes.value}>
            {data || 'XXX'} <span className={classes.key}>Projected Points</span>
          </div>
        </div>
      </div>
    </div>
  </div>

export default withStyles(styles)(DialogHead)

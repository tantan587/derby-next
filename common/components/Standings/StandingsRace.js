import React from 'react'
import { withStyles } from 'material-ui'

import chooseHorse from '../Icons/Horses/horseUtil'

import Blocks from '../Icons/Horses/Blocks'
import FinishLine from './FinishLine'
import MonthIndicator from './LeagueSeasons/MonthIndicator'
import SeasonsIndicator from './LeagueSeasons/SeasonsIndicator'

import { findMostPoints } from './standingsUtil'

const styles = {
  root: {
    fontFamily: '\'Roboto\', sans-serif'
  }
}

class StandingsRace extends React.Component {
  render() {
    const  { owners, dates, classes } = this.props
    const { season_start, season_end, current_time } = dates

    const fullDifference = season_end - season_start
    const currentDifference = (current_time - season_start) / fullDifference
    const restDifference = (season_end - current_time) / fullDifference

    const mostPoints = findMostPoints(owners)
    const horseWidth = owner => (owner.total_points / mostPoints) * (currentDifference * 100)

    return (
      <div className={classes.root}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            {
              owners.map(owner =>
                <div style={{ display: 'flex' }}>
                  <div id={owner.owner_name} style={{
                    position: 'relative',
                    width: '100%',
                    height: 20,
                    lineHeight: '20px',
                    borderTop: '1px solid #B1744D',
                    borderBottom: '1px solid #B1744D',
                    backgroundColor: '#E6AB76',
                    color: '#B1744D'
                  }}>
                    <span style={{ color: 'grey' }}> ▮ </span> {owner.owner_name}
                    {/* <Blocks style={{ position: 'absolute', left: `calc(${horseWidth(owner)}% - 53px)` }} /> */}
                    { chooseHorse(owner, { position: 'absolute', left: `calc(${horseWidth(owner)}% - 53px)` }) }
                  </div>
                </div>
              )
            }
          </div>
          <FinishLine />
        </div>
        <MonthIndicator />
        <div style={{ display: 'flex', height: 20 }}>
          <div style={{
            backgroundColor: '#47311C',
            width: `${currentDifference * 100}%`,
            color: 'white',
            textTransform: 'uppercase'
          }}>
            <span style={{ fontWeight: 600, position: 'relative' }}>
              Derby Fantasy Football League
            </span>
              &nbsp; &nbsp; Season Progress
            {/* <div
              style={{
                content:'',
                display:'block',
                position:'absolute',
                top:'10px',
                left:'100%',
                width:0,
                height:10,
                borderColor: 'transparent transparent transparent black',
                borderStyle: 'solid',
                borderWidth: '10px',
              }}
            /> */}
          </div>
          <div style={{ backgroundColor: '#E9AA45', width: `${restDifference * 100}%` }} />
        </div>
        <SeasonsIndicator
          start={season_start}
          end={season_end}
          fullDifference={fullDifference}
        />
      </div>
    )
  }
}

export default withStyles(styles)(StandingsRace)
// export default StandingsRace

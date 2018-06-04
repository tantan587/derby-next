import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import chooseHorse from '../Icons/Horses/horseUtil'

import Blocks from '../Icons/Horses/Blocks'
import FinishLine from './FinishLine'
import MonthIndicator from './LeagueSeasons/MonthIndicator'
import SeasonsIndicator from './LeagueSeasons/SeasonsIndicator'

import { findMostPoints } from './standingsUtil'

const styles = {
  root: {
    fontFamily: '\'Roboto\', sans-serif'
  },
  arrowRight: {
    width: 0, 
    height: 0,
    borderTop: '10px solid #EBAB38',
    borderBottom: '10px solid #EBAB38',
    borderLeft: '20px solid #392007',
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
    const horseWidth = owner => (owner.total_points / mostPoints) * 100
    owners[0].total_points = 0

    return (
      <div className={classes.root}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            {
              owners.map((owner,i) =>
                <div key={i} style={{ display: 'flex' }}>
                  <div id={owner.owner_name} style={{
                    width: '100%',
                    height: 20,
                    lineHeight: '20px',
                    borderTop: '1px solid #B1744D',
                    borderBottom: '1px solid #B1744D',
                    backgroundColor: '#E6AB76',
                    color: '#B1744D'
                  }}>
                    <span style={{ color: 'grey' }}> ▮ </span> {owner.owner_name}
                    <div style={{ position: 'relative', top: -20, height: 20, width: `calc(${currentDifference * 100}% - 53px)`}}>
                      { chooseHorse(owner, { position: 'absolute', left: `calc(${horseWidth(owner)}%)` }) }
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          <FinishLine height={owners.length} />
        </div>
        <MonthIndicator />
        <div style={{ display: 'flex', height: 20 }}>
          <div style={{
            backgroundColor: '#392007',
            width: `${currentDifference * 100}%`,
            color: 'white',
            textTransform: 'uppercase'
          }}>
            <div style={{ position: 'relative', width: 500, top: 0, left: 0 }}>
            <span style={{ fontWeight: 600, position: 'relative', marginLeft:10 }}>
              Derby Fantasy League
              </span>
              &nbsp; &nbsp; Season Progress
            </div>
                
          </div>
          <div className={classes.arrowRight}></div>
          <div style={{ backgroundColor: '#EBAB38', width: `${restDifference * 100}%` }} />
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

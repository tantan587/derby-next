import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import OwnerHorse from '../Icons/Avatars/OwnerHorse'
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
    const  { owners, seasons, classes } = this.props

    let sd = new Date(Object.values(seasons).map(x => x.start).sort()[0])
    let season_start = new Date(sd.getFullYear(), sd.getMonth(), 1)
    let ed = new Date(Object.values(seasons).map(x => x.end).sort()[Object.keys(seasons).length - 1])
    
    //need to adjust this if it doesnt end on Exactly at the end of a month
    let season_end =ed//= new Date(ed.getFullYear(), ed.getMonth(), 30)
    let current_time = new Date()

    const fullDifference = season_end - season_start
    const currentDifference = (current_time - season_start) / fullDifference
    const restDifference = (season_end - current_time) / fullDifference

    const mostPoints = findMostPoints(owners)
    const horseWidth = owner => (owner.total_points / mostPoints) * 100
    
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
                      { OwnerHorse(owner.avatar, { position: 'absolute', left: `calc(${horseWidth(owner)}%)` }) }
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          <FinishLine height={owners.length} />
        </div>
        <MonthIndicator start={season_start}  end={season_end}/>
        <div style={{ display: 'flex', height: 20 }}>
          <div style={{
            backgroundColor: '#392007',
            width: `${currentDifference * 100}%`,
            color: 'white',
            textTransform: 'uppercase'
          }}>
            <div style={{ position: 'relative', width: 500, top: 0, left: 0 }}>
              <span style={{ fontWeight: 600, position: 'relative', marginLeft:10 }}>
              Derby Fantasy Wins League
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
          seasons={seasons}
        />
      </div>
    )
  }
}

export default withStyles(styles)(StandingsRace)

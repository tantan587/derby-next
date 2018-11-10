import { withStyles } from '@material-ui/core/styles'
import sportLeagues from '../../../../data/sportLeagues.json'

import DerbyPopper from '../../UI/DerbyPopper'

const styles = () => ({
  indicator: {
    '&:hover': {
      boxShadow: '0px 0px 30px 5px #EAAB39'
    }
  }
})

const RegularSeason = ({ sportId, width }) =>
  <div
    style={{
      backgroundColor: '#0E7838',
      // color: 'white',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: width + '%'
      // width: ( Date.parse(seasons[sportId].playoffs) - Date.parse(seasons[sportId].start) ) / fullDifference * 100 + '%'
    }}>
    &nbsp; &nbsp; { sportLeagues[sportId].displayName } season
  </div>

const PlayoffsSeason = ({ width }) =>
  <div
    style={{
      backgroundColor: '#0E7838',
      // color: 'white',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      borderLeft: '1px solid white',
      textOverflow: 'ellipsis',
      width: width + '%'
    }} />

const FullSeason = ({ seasons, sportId, fullDifference, classes, ...props }) =>
  <div
    {...props}
    className={classes.indicator}
    style={{
      backgroundColor: '#0E7838',
      // color: 'white',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: ( Date.parse(seasons[sportId].end) - Date.parse(seasons[sportId].start) ) / fullDifference * 100 + '%'
    }}>
    &nbsp; &nbsp; { sportLeagues[sportId].displayName } season
  </div>

const SeasonsIndicator = ({ start, end, fullDifference, seasons, classes }) =>
{
  const FullPercent = sportId => ( Date.parse(seasons[sportId].end) - Date.parse(seasons[sportId].start) ) / fullDifference * 100
  const RegPercent = sportId => ( Date.parse(seasons[sportId].playoffs) - Date.parse(seasons[sportId].start) ) / fullDifference * 100
  const PlayoffPercent = sportId => ( Date.parse(seasons[sportId].end) - Date.parse(seasons[sportId].playoffs) ) / fullDifference * 100

  return <div style={{ backgroundColor: '#299149', textTransform: 'uppercase' }}>
    {
      Object.keys(seasons).map(sportId => <div key={sportId} style={{ display: 'flex' }}>
        <div style={{
          width: (Date.parse(seasons[sportId].start) - start) / fullDifference * 100 + '%'
        }} />
        {
          seasons[sportId].playoffs ?
            <DerbyPopper season={seasons[sportId]}>
              {({ handleOpen, handleClose, id }) =>
                <div
                  aria-describedby={id}
                  className={classes.indicator}
                  style={{ display: 'flex', width: FullPercent(sportId) + '%' }}
                  onMouseEnter={handleOpen}
                  onMouseLeave={handleClose}
                >
                  <RegularSeason
                    width={RegPercent(sportId) / FullPercent(sportId) * 100}
                    seasons={seasons}
                    fullDifference={fullDifference}
                    sportId={sportId}
                    classes={classes}
                  />
                  <PlayoffsSeason
                    width={PlayoffPercent(sportId) / FullPercent(sportId) * 100}
                    seasons={seasons}
                    fullDifference={fullDifference}
                    sportId={sportId}
                    classes={classes}
                  />
                </div>}
            </DerbyPopper> :
            <DerbyPopper season={seasons[sportId]}>
              {({ handleOpen, handleClose, id }) =>
                <FullSeason
                  seasons={seasons}
                  sportId={sportId}
                  fullDifference={fullDifference}
                  classes={classes}
                  onMouseEnter={handleOpen}
                  onMouseLeave={handleClose}
                  aria-describedby={id}
                />}
            </DerbyPopper>
        }
        <div
          style={{ width: ( end - Date.parse(seasons[sportId]) ) / fullDifference * 100 + '%' }}
        />
      </div>)
    }
  </div>
}

export default withStyles(styles)(SeasonsIndicator)

import { withStyles } from '@material-ui/core/styles'
import sportLeagues from '../../../../data/sportLeagues.json'

const styles = theme => ({
  indicator: {
    '&:hover': {
      '& :nth-child(2)':{
        zIndex: 11,
        boxShadow: '-9px 0px 30px 5px #EAAB39'
      },
      '& :nth-last-child(2)': {
        zIndex: 10,
        boxShadow: '0px 0px 30px 5px #EAAB39'
      }
    }
    // '&:hover': {
    //   boxShadow: '0px 0px 30px 5px #EAAB39'
    // }
  }
})

const RegularSeason = ({ seasons, sportId, fullDifference, classes }) =>
  <div
    style={{
      backgroundColor: '#0E7838',
      // color: 'white',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: ( Date.parse(seasons[sportId].playoffs) - Date.parse(seasons[sportId].start) ) / fullDifference * 100 + '%'
    }}>
    &nbsp; &nbsp; { sportLeagues[sportId].displayName } season
  </div>

const PlayoffsSeason = ({ seasons, sportId, fullDifference, classes }) =>
  <div
    style={{
      backgroundColor: '#0E7838',
      // color: 'white',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      borderLeft: '1px solid white',
      textOverflow: 'ellipsis',
      width: ( Date.parse(seasons[sportId].end) - Date.parse(seasons[sportId].playoffs) ) / fullDifference * 100 + '%'
    }} />

const FullSeason = ({ seasons, sportId, fullDifference }) =>
  <div
    style={{
      backgroundColor: '#0E7838',
      // color: 'white',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: ( Date.parse(seasons[sportId].end) - Date.parse(seasons[sportId].start) ) / fullDifference * 100 + '%'
    }}>
    {console.log('fraction', fullDifference, fullDifference / Date.parse(seasons[sportId].end))}
    &nbsp; &nbsp; { sportLeagues[sportId].displayName } season
  </div>

const SeasonsIndicator = ({ start, end, fullDifference, seasons, classes }) =>
{
  return <div style={{ backgroundColor: '#299149', textTransform: 'uppercase' }}>
    {
      Object.keys(seasons).map(sportId => <div className={classes.indicator} key={sportId} style={{ display: 'flex' }}>
        <div style={{
          width: (Date.parse(seasons[sportId].start) - start) / fullDifference * 100 + '%'
        }} />
        {
          seasons[sportId].playoffs ?
            <React.Fragment>
              <RegularSeason
                seasons={seasons}
                sportId={sportId}
                fullDifference={fullDifference}
                classes={classes}
              />
              <PlayoffsSeason
                seasons={seasons}
                sportId={sportId}
                fullDifference={fullDifference}
                classes={classes}
              />
            </React.Fragment> :
            <FullSeason
              seasons={seasons}
              sportId={sportId}
              fullDifference={fullDifference}
            />
        }
        <div
          style={{ width: ( end - Date.parse(seasons[sportId]) ) / fullDifference * 100 + '%' }}
        />
      </div>)
    }
  </div>
}

export default withStyles(styles)(SeasonsIndicator)

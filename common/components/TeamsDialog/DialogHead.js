import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  container: {
    paddingTop: 20,
    width: '100%',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column',
      margin: 0,
      '& > :last-child': {
        paddingBottom: 20
      }
      // padding: '12px 8px 0px 8px',
    },
    [theme.breakpoints.up('sm')]: {
      '& > :last-child': {
        position: 'relative',
        right: '8vw'
      }
    },
    '& > *': {
      paddingLeft: 12,
    }
  },
  statsContatiner: {
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column',
      margin: 0
    }
  },
  value: {
    fontWeight: 600,
    fontSize: 18,
    margin: '5px 0px',
    overflow: 'hidden'
  },
  key: {
    fontWeight: 500,
    fontSize: 12,
    color: 'grey',
  }
})


const DialogHead = ({ oneTeam, classes }) =>
{
  if (!oneTeam)
  {
    return null
  }
  return (
    <div className={classes.container} style={{ display: 'flex', justifyContent: 'space-around' }}>
      <img
        preserveAspectRatio='true'
        style={{height:100}}
        src={oneTeam.logo_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Chicago_Cubs_logo.svg/99px-Chicago_Cubs_logo.svg.png'}
      />
      <div style={{ width: 315 }}>
        <div style={{
          fontFamily: '\'Roboto\', sans-serif',
          fontSize: 26,
          fontWeight: 700,
          color: '#48311A',
        }}>
          {oneTeam.team_name || 'Chicago Cubs'}
        </div>
        <div className={classes.statsContatiner} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ width: '50%' }}>
            <div className={classes.value}>
              {oneTeam.owner || 'XXX'} <span className={classes.key}>Owner</span>
            </div>
            <div className={classes.value}>
              {oneTeam.record || 'XXX'} <span className={classes.key}>Record</span>
            </div>
            <div className={classes.value}>
              {oneTeam.projected || 'XXX'} <span className={classes.key}>Projected Record</span>
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <div className={classes.value}>
              {oneTeam.points || oneTeam.points === 0 ? oneTeam.points : 'XXX'} <span className={classes.key}>Current Points</span>
            </div>
            <div className={classes.value}>
              {Math.round(oneTeam.proj_points,0) || Math.round(oneTeam.proj_points,0) === 0 ? Math.round(oneTeam.proj_points,0) : 'XXX'} <span className={classes.key}>Projected Points</span>
            </div>
            <div className={classes.value}>
              {oneTeam.ranking || oneTeam.ranking === 0 ? oneTeam.ranking : 'XXX'} <span className={classes.key}>Overall Ranking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

export default withStyles(styles)(DialogHead)

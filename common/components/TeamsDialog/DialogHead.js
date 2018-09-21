import { withStyles } from '@material-ui/core/styles'

const styles = {
  value: {
    fontWeight: 600,
    fontSize: 18,
    margin: '5px 0px'
  },
  key: {
    fontWeight: 500,
    fontSize: 12,
    color: 'grey',
  }
}


const DialogHead = ({ oneTeam, classes }) =>
{
  if (!oneTeam)
  {
    return null
  }
  return (
    <div style={{ display: 'flex', width: 575, margin: '35px 0px 35px 30px', justifyContent: 'center' }}>
      <img
        preserveAspectRatio='true'
        style={{ maxHeight:100, marginLeft:20, marginRight:35}}
        src={oneTeam.logo_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Chicago_Cubs_logo.svg/99px-Chicago_Cubs_logo.svg.png'}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, width: 375 }}>
          <div>
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
          <div>
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

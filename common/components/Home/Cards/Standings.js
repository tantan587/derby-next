import { withStyles } from '@material-ui/core/styles'

import chooseSilk from '../../Icons/Silks/silkUtil'

const styles = {
  root: {
    fontFamily: 'Roboto',
    color: '#909090'
  },
  owner: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: '10px',
    borderBottom: '1px solid lightgrey',
  },
  names: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 8,
    width: 75
  },
  ownerName: {
    color: '#838383',
    fontWeight: 500
  },
  username: {
    fontSize: 10
  },
  points: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
    fontSize: 14,
    fontWeight: 600
  }
}

const Standings = withStyles(styles)(({ classes, owners }) =>
  <div className={classes.root}>
    {
      owners.map(owner => <div id={owner.owner_id} className={classes.owner}>
        {console.log(owner)}
        <div style={{ display: 'flex' }}>
          { chooseSilk(owner, { height: 50, margin: '8px 0px' }) }
          <div className={classes.names}>
            <div className={classes.ownerName}>{owner.owner_name}</div>
            <div className={classes.username}>{owner.username}</div>
          </div>
        </div>

        <div className={classes.points}>
          <div>{owner.total_points} <span style={{ fontWeight: 400 }}> Pts</span></div>
        </div>
      </div>)
    }
  </div>
)

export default Standings

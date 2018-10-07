import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import OwnerSilk from '../../Icons/Avatars/OwnerSilk'
import Router from 'next/router'

const styles = {
  root: {
    fontFamily: 'Roboto',
    color: '#909090',
    '&:hover': {
      cursor: 'pointer',
    },
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

class Standings extends React.Component {

  gotToRoster = (o) => {
    Router.push('/mainleagueroster?a=' + o)
  }
  render() {
    const {classes, owners} = this.props
    return (
      <div className={classes.root}>
        {
          owners.map((owner,i) => <div  key={i} id={owner.owner_id} className={classes.owner}  onClick={() => this.gotToRoster(owner.owner_id)}>
            <div key={i} style={{ display: 'flex' }}>
              { OwnerSilk(owner.avatar, { height: 50, margin: '8px 0px' }) }
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
  }
}

export default withStyles(styles)(Standings)

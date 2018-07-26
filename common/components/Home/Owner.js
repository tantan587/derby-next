import { withStyles } from '@material-ui/core/styles'
import OwnerSilk from '../Icons/Avatars/OwnerSilk'
import Avatar from '@material-ui/core/Avatar'

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '5%',
    width: 300,
    height: 150
  },
  silkContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //height: 150,
    //width: 150,
    //backgroundColor: 'white'
  },
  data: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    fontFamily: 'HorsebackSlab',
    fontSize: 18,
    marginLeft : 20,
    textTransform: 'uppercase',
    '& > div > .entry': {
      marginLeft: 10,
      fontFamily: 'Roboto',
      fontWeight: 300,
      fontSize: 12,
    }
  }
}

const Owner = withStyles(styles)(({ classes, myOwner, num }) => {
  let ownerData = []
  if(myOwner)
    ownerData = [
      { entry: 'Points', data: myOwner.total_points },
      { entry: `of ${num} Teams`, data: myOwner.rank },
    ]

  return (
    <div className={classes.root}>
      <div className={classes.silkContainer}>
        <Avatar style={{ height: 160, width: 160, backgroundColor:'white' }}>
          { myOwner && OwnerSilk(myOwner.avatar, { height: 125, width: 125 }) }
        </Avatar>
      </div>
      <div className={classes.data}>
        <div>{myOwner && myOwner.owner_name}</div>
        {
          ownerData.map((dataObj, i) => <div key={i} id={dataObj.entry}>
            <span className="data">{dataObj.data}</span>
            <span className="entry">{dataObj.entry}</span>
          </div>)
        }
      </div>
    </div>
  )
})

export default Owner

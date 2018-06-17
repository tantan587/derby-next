import { withStyles } from '@material-ui/core/styles'
import OwnerSilk from '../Icons/Avatars/OwnerSilk'

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
    height: 150,
    width: 150,
    backgroundColor: 'white'
  },
  data: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    fontFamily: 'HorsebackSlab',
    fontSize: 18,
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

  const ownerData = [
    { entry: 'Record', data: 'N/A' },
    { entry: 'Points Overall', data: myOwner.total_points },
    { entry: `of ${num} Teams`, data: myOwner.rank },
  ]

  return (
    <div className={classes.root}>
      <div className={classes.silkContainer}>
        { OwnerSilk(myOwner, { height: 125, width: 125 }) }
      </div>
      <div className={classes.data}>
        <div>{myOwner.owner_name}</div>
        {
          ownerData.map(dataObj => <div id={dataObj.entry}>
            <span className="data">{dataObj.data}</span>
            <span className="entry">{dataObj.entry}</span>
          </div>)
        }
      </div>
    </div>
  )
})

export default Owner

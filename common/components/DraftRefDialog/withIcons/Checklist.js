import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import SportIconText from '../../Icons/SportIconText'
import SportIconTriple from '../../Icons/SportIconTriple'

const styles = theme => ({
  container: {
    marginTop: 24,
    padding: '0px 1%',
    backgroundColor: '#333333'
  },
  title: {
    fontFamily: 'HorsebackSlab',
    color: '#229246',
    alignSelf: 'center',
    // marginTop: 20,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginTop: 20,
    }
  },
  iconGrid: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    [theme.breakpoints.down('sm')]: {
      marginTop: 20
    },
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    }
  },
  singleIcon: {
    color: 'blue'
  }
})

const Checklist = ({ classes }) => {
  return (
    <div className={classes.container}>
      <Grid container alignItems="flex-end">
        <Grid item xs={12} sm={12} md={2} lg={2} className={classes.title}>Roster Checklist</Grid>
        <Grid item xs={12} sm={6} md={2} lg={2} className={classes.iconGrid}>
          <SportIconText sportId={102} text={['NFL', 'NFC']} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} />
          <SportIconText sportId={102} text={['NFL', 'AFC']} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} />
          <SportIconText sportId={101} text={['NBA', 'WEST']} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2} className={classes.iconGrid}>
          <SportIconText sportId={101} text={['NBA', 'EAST']} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} />
          <SportIconText sportId={103} text={['MLB', 'NL']} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} />
          <SportIconText sportId={103} text={['MLB', 'AL']} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2} className={classes.iconGrid}>
          <SportIconText sportId={104} text={['NHL', 'WEST']} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} />
          <SportIconText sportId={104} text={['NHL', 'EAST']} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} />
          <SportIconText sportId={107} text={['EPL', 'SOCCER']} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2} className={classes.iconGrid}>
          <SportIconTriple
            sportId={106}
            text={
              window.innerHeight > 1500 ?
              ["NCAAM BASKETBALL from", "10 MAJOR CONFERENCES"] :
              ["NCAAM", "BASKETBALL"]
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={2} className={classes.iconGrid}>
          <SportIconTriple
            sportId={105}
            text={
              window.innerHeight > 1500 ?
              ["NCAAM FOOTBALL from", "10 MAJOR CONFERENCES"] :
              ["NCAAM", "FOOTBALL"]
            }
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(Checklist)
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 350,
    width: 300,
    backgroundColor: 'white',
    borderRadius: '0px',
    color: 'black'
  },
  title: {
    margin: '14px 0px',
    textAlign: 'center',
    fontFamily: 'HorsebackSlab',
    fontSize: 14,
    color: '#2D934C'
  },
  button: {
    margin: '14px 0px',
  },
  container: {
    width: '90%',
    // overflowY: 'scroll'
  }
}

const DerbyCard = withStyles(styles)(({ classes, title, children, scroll = false, Button }) => {
  return (
    <Card className={classes.root}>
      <div className={classes.title}>
        {title}
      </div>
      <div className={classes.container} style={{ overflowY: scroll && 'scroll' }}>
        {children}
      </div>
      <div className={classes.button}>
        {Button && <Button />}
      </div>
    </Card>
  )
})

export default DerbyCard

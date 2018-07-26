import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Switch from '@material-ui/core/Switch'

const styles = theme => ({
  root: {
    height: 350,
    width: '90%',
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
    },
    paddingBottom: 18,
  },
  content: {
    display: 'flex',
    height: '100%',
    padding: '20px 16px 0px 16px',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: 600
  },
  switchRoot: {
    height: 20,
    borderRadius: 3,
    opacity: '1 !important',
    backgroundColor: '#E2E2E2'
  },
  icon: {
    height: 15,
    width: 15,
    marginTop: 5,
    borderRadius: 3,
    color: 'white',
    backgroundColor: 'white'

  },
  checked: {
    color: 'blue',
    '& + span' : {
      backgroundColor: '#299149 !important'
    }
  },
  switchContainer: {
    display: 'flex',
    alignSelf: 'center'
  },
  label: {
    alignSelf: 'center',
    fontSize: 14
  }
})

const EmailCard = withStyles(styles)(({ classes, title, copy, check, label }) =>
  <Card className={classes.root}>
    <div style={{
      display: 'flex',
      height: '100%',
      padding: '20px 16px 0px 16px',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div className={classes.title}>{title}</div>
        {copy}
      </div>
      {
        check !== undefined &&
        <div className={classes.switchContainer}>
          <div className={classes.label}>{label}</div>
          <Switch
            classes={{
              bar: classes.switchRoot,
              icon: classes.icon,
              checked: classes.checked
            }}
          />
        </div>
      }
    </div>
  </Card>)

export default EmailCard

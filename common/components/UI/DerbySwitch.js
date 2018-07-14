import { withStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'

const styles = {
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
  }
}

const DerbySwitch = withStyles(styles)(({ onClick, state, classes }) =>
  <Switch
    classes={{
      root: classes.root,
      bar: classes.switchRoot,
      icon: classes.icon,
      checked: classes.checked,
    }}
    onClick={onClick && onClick.bind(null, state)}
  />
)

export default DerbySwitch

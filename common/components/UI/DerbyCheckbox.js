import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    right: 14
  }
}

const DerbyCheckbox = withStyles(styles)(({ classes, onClick, state, checked }) => <Checkbox
  classes={{ root: classes.root }}
  onClick={onClick && onClick.bind(null, state)} // Pass in the function and the piece of state to change, that's all
  checked={checked}
/>)

export default DerbyCheckbox

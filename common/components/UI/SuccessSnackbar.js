import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'


const styles = {
  snack: {
    backgroundColor: '#299149',
    color:'#e3dac9',
  }
}

const SuccessSnackbar = withStyles(styles)(({onClose, stateKey, classes, message}) => {


return <Snackbar
anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
open={stateKey}
autoHideDuration={5000}
message={message}
onClose={onClose}
ContentProps={{
  'aria-describedby': 'message-id',
  classes: {
    root: classes.snack
  }
}}
action={(
  <IconButton
    key="close"
    aria-label="Close"
    color="inherit"
    onClick={onClose}
  >
    <CloseIcon />
  </IconButton>
)}
/>
})

export default SuccessSnackbar
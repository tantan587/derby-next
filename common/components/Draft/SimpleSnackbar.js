import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  button : {
    backgroundColor: theme.palette.secondary.A700,
    color: '#e3dac9',
  },
  banner : {
    color:'#e3dac9',
    backgroundColor: theme.palette.primary[500],
  }
})

class SimpleSnackbar extends React.Component {

  render() {
    const { classes, open, message, handleClose } = this.props
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
            classes: {
              root: classes.banner
            }
          }}
          message={<span id="message-id">{message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              style={{color:'#e3dac9'}}
              className={classes.close}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    )
  }
}

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleSnackbar)
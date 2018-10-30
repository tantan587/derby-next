import { Component, Fragment } from 'react'
// import { withStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'

class DerbyPopper extends Component {
  state = {
    anchorEl: null,
    open: false,
  }

  handleOpen = event => {
    const { currentTarget } = event
    this.setState({
      anchorEl: currentTarget,
      open: true,
    })
  }

  handleClose = event => {
    const { currentTarget } = event
    this.setState({
      anchorEl: currentTarget,
      open: false,
    })
  }

  render() {
    const { children, season } = this.props
    const { anchorEl, open } = this.state
    const id = open ? 'simple-popper' : null

    return (
      <Fragment>
        {children({ handleOpen: this.handleOpen, handleClose: this.handleClose, id })}
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Typography>{
                  season.playoffs ?
                    `Start: ${new Date(season.start).toLocaleDateString('en-US')}
                    Playoffs: ${new Date(season.playoffs).toLocaleDateString('en-US')}
                    End: ${new Date(season.end).toLocaleDateString('en-US')}` :
                    `Start: ${new Date(season.start).toLocaleDateString('en-US')}
                    End: ${new Date(season.end).toLocaleDateString('en-US')}`
                }</Typography>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Fragment>
    )
  }
}

export default DerbyPopper

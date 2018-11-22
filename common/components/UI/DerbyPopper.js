import { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import Typography from '@material-ui/core/Typography'
import DialogContent from '@material-ui/core/DialogContent'
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
    const { children, season, classes, usePlayoffs = true } = this.props
    const { anchorEl, open } = this.state
    const id = open ? 'simple-popper' : null

    return (
      <Fragment>
        {children({ handleOpen: this.handleOpen, handleClose: this.handleClose, id })}
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <DialogContent>{
                  usePlayoffs ?
                    <Typography>
                      <div>
                        <span className={classes.span}>Start:</span> {new Date(season.start).toLocaleDateString('en-US')}
                      </div>
                      <div>
                        <span className={classes.span}>Playoffs:</span> {new Date(season.playoffs).toLocaleDateString('en-US')}
                      </div>
                      <div>
                        <span className={classes.span}>End:</span> {new Date(season.end).toLocaleDateString('en-US')}
                      </div>
                    </Typography> :
                    <Typography>
                      <div>
                        <span className={classes.span}>Start:</span> {new Date(season.start).toLocaleDateString('en-US')}
                      </div>
                      <div>
                        <span className={classes.span}>End:</span> {new Date(season.end).toLocaleDateString('en-US')}
                      </div>
                    </Typography>
                }</DialogContent>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Fragment>
    )
  }
}

export default withStyles({ span: { fontFamily: 'museo-slab-bold', color: 'rgb(34, 146, 70)' } })(DerbyPopper)

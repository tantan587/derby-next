import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withRoot from '../common/components/withRoot'
import Layout from '../common/components/Layout'
import withRedux from 'next-redux-wrapper'
import storeFactory from '../common/store'
const store = storeFactory(false)


const styles = {
  root: {
    textAlign: 'center',
    paddingTop: 200,
    backgroundImage: 'url("/static/derbyhome.png")',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '600px',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }
}


class Index extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({
      open: false,
    })
  };

  handleClick = () => {
    this.setState({
      open: true,
    })
  };

  render() {
    return (
      <Layout>
        <div className={this.props.classes.root}>
          <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle>Super Secret Password</DialogTitle>
            <DialogContent>
              <DialogContentText>1-2-3-4-5</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClose}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Typography type="display1" style={{color:'white'}} gutterBottom>
            Derby
          </Typography>
          <Typography type="subheading" style={{color:'white'}} gutterBottom>
            Draft Teams.
            Watch Games.
          </Typography>
          <Typography type="subheading" style={{color:'white'}} gutterBottom>
            Earn Points.
            Win The Race.
          </Typography>
          <Button raised color="accent" onClick={this.handleClick}>
            Super Secret Password
          </Button>
        </div>
      </Layout>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRedux(storeFactory)(withRoot(withStyles(styles)(Index)))
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
import '../styles/style.css'
//https://github.com/zeit/next.js/tree/master/examples/with-global-stylesheet
const store = storeFactory(false)


const styles = {
  root: {
    textAlign: 'center',
    paddingTop: 200,
    backgroundImage: 'url("/static/images/derbyhome.png")',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '600px',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    //fontFamily:'Tinos'
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
            <DialogTitle>Our Super Secret Password</DialogTitle>
            <DialogContent>
              <DialogContentText>Why would we give this to you?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClose}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Typography 
            type="display1" style={{color:'white', fontFamily:'HorsebackSlab'}} gutterBottom>
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
            Our Super Secret Password
          </Button>
          <div>
            <img src='https://upload.wikimedia.org/wikipedia/en/0/02/Washington_Wizards_logo.svg' alt="Basketball" width="16" height="16"/>
          </div>
        </div>
      </Layout>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withRedux(storeFactory)(withRoot(withStyles(styles)(Index)))
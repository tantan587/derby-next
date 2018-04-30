import { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import Tabs, {
  Tab,
  TabContainer,
} from 'material-ui/Tabs'
import { withStyles } from 'material-ui/styles'

import { handleCloseDialog } from '../../actions/dialog-actions'

import DialogHead from './DialogHead'
import DialogInfo from './DialogInfo'
import DialogTable from './DialogTable/DialogTable'

const styles = theme => {
  console.log('theme is', theme.palette.primary)
  return {
    root: {
      minHeight: 48
    },
    indicator: {
      height: 10,
      backgroundColor: theme.palette.primary.main,
      color: 'black',
      transition: 'none'
    },
    green: {
      backgroundColor: theme.palette.primary.main,
    },
  }
}

class TeamsDialog extends Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    console.log('hello, props are', this.props)
    const { value } = this.state
    const { teamsDialog, handleCloseDialog, classes } = this.props
    const { open } = teamsDialog

    console.log('open is', open, classes, this.props)

    return (
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth={false}
      >
        <div style={{ width: 750, height: 500 }}>
          <div>
            This contains our picture and records :-O
            <DialogHead />
          </div>
          <div>
            This contains our Tabs
            <Tabs
              value={value}
              onChange={this.handleChange}
              style={{ height: 20 }}
              classes={{ root: classes.root, indicator: classes.indicator }}
            >
              <Tab
                classes={{ root: classes.green }}
                style={{
                  color: value === 0 ? 'orange' : 'grey',
                  backgroundColor: value != 0 && 'white',
                }}
                label="LAST FIVE GAMES" />
              <Tab
                classes={{ root: classes.green }}
                style={{
                  color: value === 1 ? 'orange' : 'grey',
                  backgroundColor: value != 1 && 'white',
                }}
                label="NEXT FIVE GAMES" />
              <Tab
                classes={{ root: classes.green }}
                style={{
                  color: value === 2 ? 'orange' : 'grey',
                  backgroundColor: value != 2 && 'white',
                }}
                label="ADDITIONAL INFO" href="#basic-tabs" />
            </Tabs>
            {console.log('val is', this.state.value)}
            {
              [0, 1].includes(this.state.value) ?
                <DialogTable /> :
                <DialogInfo />
            }
          </div>
        </div>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({
  teamsDialog: state.teamsDialog,
})

const mapDispatchToProps = { handleCloseDialog }

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TeamsDialog))

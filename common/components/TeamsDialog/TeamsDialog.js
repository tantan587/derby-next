import { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import Tabs, {
  Tab,
  TabContainer,
} from 'material-ui/Tabs'
import { withStyles } from 'material-ui/styles'

import { handleCloseDialog } from '../../actions/dialog-actions'
import { clickedOneTeam } from '../../actions/sport-actions'

import DialogHead from './DialogHead'
import DialogInfo from './DialogInfo'
import DialogTable from './DialogTable/DialogTable'
import DialogLastFive from './DialogTable/DialogLastFive'
import DialogNextFive from './DialogTable/DialogNextFive'

const styles = theme => {
  return {
    root: {
      minHeight: 48,
    },
    indicator: {
      height: 10,
      backgroundColor: '#229246',
      color: 'black',
      transition: 'none'
    },
    green: {
      backgroundColor: '#229246',
    },
    dialog_styles: {
      fontFamily: '\'Roboto\', sans-serif',
    }
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
    const { value } = this.state
    const { teamsDialog, handleCloseDialog, oneTeam, classes, teams } = this.props
    const { open } = teamsDialog
    const { lastFive, nextFive } = oneTeam

    return ( open &&
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth={false}
        classes={{ root: classes.dialog_styles }}
      >
        <div style={{ width: 750, height: 500 }}>
          <div>
            <DialogHead
              oneTeam={oneTeam}
              currTeam={teamsDialog.currTeam}
            />
          </div>
          <div>
            <Tabs
              value={value}
              onChange={this.handleChange}
              style={{ height: 20, marginLeft: 40 }}
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
                label="ADDITIONAL INFO" />
            </Tabs>
            {console.log('val is', this.state.value)}
            {/* {
              [0, 1].includes(this.state.value) ?
                <DialogLastFive
                  lastFive={lastFive}
                  teams={teams}
                /> :
                <DialogInfo />
            } */}
            {{
              0: <DialogLastFive
                oneTeam={oneTeam}
                lastFive={lastFive}
                teams={teams}
              />,
              1: <DialogNextFive
                oneTeam={oneTeam}
                nextFive={nextFive}
                teams={teams}
              />,
              2: <DialogInfo />
            }[this.state.value]}
          </div>
        </div>
      </Dialog>
    )
  }
}

const mapStateToProps = state => ({
  teamsDialog: state.teamsDialog,
  oneTeam: state.oneTeam,
  teams: state.teams,
})

const mapDispatchToProps = { handleCloseDialog, clickedOneTeam }

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TeamsDialog))
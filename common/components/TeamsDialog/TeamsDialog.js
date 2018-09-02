import { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { withStyles } from '@material-ui/core/styles'
import { handleCloseDialog } from '../../actions/dialog-actions'
import { organizeData } from './tableData'
import DialogHead from './DialogHead'
import DialogInfo from './DialogInfo'
import DialogLastFive from './DialogTable/DialogLastFive'
import DialogNextFive from './DialogTable/DialogNextFive'

const styles = () => {
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
    const { teamsDialog, handleCloseDialog, oneTeam, activeLeague, classes, teams } = this.props
    const { open } = teamsDialog
    const { lastFive, nextFive } = oneTeam
    if (!oneTeam.team_id)
    {
      return <div/>
    }
    let teamId = oneTeam.team_id
    oneTeam.team_name = teams[teamId].team_name
    let eligible_teams = activeLeague.total_eligible_teams ? activeLeague.total_eligible_teams : 280
    if(activeLeague.teams[teamId])
    {
      let team = activeLeague.teams[teamId]
      let owner = activeLeague.owners.find(x => x.owner_id === team.owner_id)
      oneTeam.owner = owner ? owner.owner_name : 'Not Owned'
      oneTeam.points = team.points
      oneTeam.proj_points = team.proj_points
      
      oneTeam.ranking = team.eligible_ranking  + '/' + eligible_teams //activeLeague.total_eligible_teams //Object.keys(activeLeague.teams).length
      oneTeam.scoring_type_id = 1//= activeLeague.seasons[oneTeam.sport_id].scoring_type_id
    }
    if(teams[teamId])
    {
      let team = teams[teamId]
      oneTeam.record = team.wins + '-' + team.losses + (team.ties > 0 ? '-' + team.ties : '')
      oneTeam.projected = Math.round(team.projected.wins) + '-' + Math.round(team.projected.losses) + (team.projected.ties > 0 ? '-' + Math.round(team.projected.ties) : '')
    }

    return (open && lastFive && nextFive ?
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth={false}
        classes={{ root: classes.dialog_styles }}
      >
        <div
          onClick={handleCloseDialog}
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
            cursor: 'pointer',
          }}
        >
          x
        </div>
        <div style={{ width: 775, height: 650 }}>
          <div style={{ height: '30%' }}>
            <DialogHead
              oneTeam={oneTeam}
            />
          </div>
          <div style={{ height: '60%' }}>
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
            <div style={{ height: '89%', }}> { /* scrolling div */ }
              {{
                0: <DialogLastFive
                  oneTeam={oneTeam}
                  lastFive={lastFive}
                  teams={teams}
                  tableData={lastFive.map(game => organizeData({ teams, game, oneTeam }))}
                />,
                1: <DialogNextFive
                  oneTeam={oneTeam}
                  nextFive={nextFive}
                  teams={teams}
                  tableData={nextFive.map(game => organizeData({ teams, game, oneTeam }))}
                />,
                2: <DialogInfo />
              }[this.state.value]}
            </div>
          </div>
        </div>
      </Dialog>
      :
      <div/>
    )
  }
}

const mapStateToProps = state => ({
  teamsDialog: state.teamsDialog,
  oneTeam: state.oneTeam,
  teams: state.teams,
  activeLeague : state.activeLeague
})

const mapDispatchToProps = { handleCloseDialog }

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TeamsDialog))

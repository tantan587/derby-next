import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { handleOpenDialog } from '../../actions/dialog-actions'

import DerbyTableContainer from '../Table/DerbyTableContainer'
import TeamsDialog from '../TeamsDialog/TeamsDialog'


const styles = {
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  field: {
    textAlign: 'center',
  }
}

class MainLeagueTeams extends React.Component {


  render() {
    let myTeams = []
    Object.values(this.props.teams).map(team => myTeams.push({
      ...team,
      record:team.wins + '-' + team.losses + '-' + team.ties,
      percentage: (team.wins + team.ties + team.losses) === 0 ? 0.0.toFixed(3) : ((team.wins + 1/2*team.ties) / (team.wins + team.ties + team.losses)).toFixed(3)
    }))

    return (
      <div>
        <TeamsDialog />
        <DerbyTableContainer
          title='All Teams'
          usePagination={true}
          myRows={myTeams}
          filters={[
            {type:'tab',
              values :this.props.sportLeagues.map(x => x.sport),
              column:'sport',
              allInd:true,
              tabStyles:{background:'#707070', foreground:'white', text:'#229246'}
            },
            // {type:'checkbox',
            //   values :this.props.sportLeagues.map(x => x.sport),
            //   column:'sport'}
          ]}
          orderInd={true}
          myHeaders = {[
            {label: 'Logo', key: 'logo_url', sortId:'team_name', imageInd:true},
            {label: 'Team Name', key: 'team_name'},
            {label: 'Owner Name', key: 'owner_name'},
            {label: 'Sport League', key: 'sport'},
            {label: 'Conference', key: 'conference'},
            {label: 'Record', key: 'record', sortId:'percentage'},
            {label: 'Percentage', key: 'percentage'},
            {label: 'Points', key: 'points'}
          ]}/>
      </div>
    )
  }
}

MainLeagueTeams.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  openDialog: () => dispatch(handleOpenDialog)
})

export default connect(
  state => ({
    sportLeagues : state.sportLeagues,
    teams: state.teams,
  }),
  mapDispatchToProps,
)(withStyles(styles)(MainLeagueTeams))

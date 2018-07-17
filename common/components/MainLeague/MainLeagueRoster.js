import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { handleOpenDialog } from '../../actions/dialog-actions'
import Title from '../Navigation/Title'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
import sportLeagues from '../../../data/sportLeagues.json'
const R = require('ramda')

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

class MainLeagueRoster extends React.Component {

  

  render() {
    const {teams, activeLeague} = this.props
    const sportLeagueIds = R.keys(sportLeagues)
    let myTeams = Object.values(teams).filter(team => sportLeagueIds.includes(team.sport_id)).map(team => 
    {
      let owner = null 
      if (activeLeague.teams[team.team_id])
        owner = activeLeague.owners.filter(owner => owner.owner_id === activeLeague.teams[team.team_id].owner_id)[0]

      return {
        ...team,
        record:team.wins + '-' + team.losses + '-' + team.ties,
        percentage: (team.wins + team.ties + team.losses) === 0 ? 0.0.toFixed(3) : ((team.wins + 1/2*team.ties) / (team.wins + team.ties + team.losses)).toFixed(3),
        owner_name: owner ? owner.owner_name : 'N/A',
        //points:activeLeague.teams[team.team_id].points
      }
    })

    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title='Rosters'/>
        {/* //tabStyles:{background:'#e3dac9', foreground:'white', text:'#229246'} */}
        <TeamsDialog />
        <DerbyTableContainer
          usePagination={true}
          myRows={myTeams}
          filters={[
            {type:'tab', 
              values :this.props.activeLeague.owners.map(x => x.owner_name).sort((a,b) => a > b),
              column:'owner_name',
              tabStyles:{backgroundColor:'#e3dac9',
                color:'#48311A',
                selectedBackgroundColor:'white', 
                selectedColor:'#229246', fontSize:12}
            },
          ]}
          orderInd={true}
          myHeaders = {[
            {label: 'Logo', key: 'logo_url', sortId:'team_name', imageInd:true},
            {label: 'Team Name', key: 'team_name'},
            {label: 'Sport League', key: 'sport_id', imageInd:true},
            {label: 'Conference', key: 'conference'},
            {label: 'Record', key: 'record', sortId:'percentage'},
            {label: 'Percentage', key: 'percentage'},
            // {label: 'Points', key: 'points'}
          ]}/>
      </div>
    )
  }
}

MainLeagueRoster.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapDispatchToProps = (dispatch) => ({
  openDialog: () => dispatch(handleOpenDialog)
})

export default connect(
  state => ({
    teams: state.teams,
    activeLeague : state.activeLeague
  }),
  mapDispatchToProps,
)(withStyles(styles)(MainLeagueRoster))



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

class MainLeagueTeams extends React.Component {

  

  render() {
    const {teams, activeLeague} = this.props
    const sportLeagueIds = R.keys(sportLeagues)
    console.log(sportLeagueIds)
    let myTeams = Object.values(teams).filter(team => sportLeagueIds.includes(team.sport_id)).map(team => 
    {
      let owner = null 
      if (activeLeague.teams[team.team_id])
        owner = activeLeague.owners.find(owner => owner.owner_id === activeLeague.teams[team.team_id].owner_id)
      return {
        ...team,
        record:team.wins + '-' + team.losses + '-' + team.ties,
        percentage: (team.wins + team.ties + team.losses) === 0 ? 0.0.toFixed(3) : ((team.wins + 1/2*team.ties) / (team.wins + team.ties + team.losses)).toFixed(3),
        owner_name: owner ? owner.owner_name : 'N/A',
        //points:activeLeague.teams[team.team_id].points
      }
    })
    let ownerName = activeLeague.owners.find(x => x.owner_id = activeLeague.my_owner_id).owner_name
    let confs = [...new Set(myTeams.map(x => x.conference))].sort((a,b) => { return a > b})
    return (
      <div>
        <TeamsDialog />

        <Title color='white' backgroundColor='#EBAB38' title='All Teams'/>
        <DerbyTableContainer
          usePagination={true}
          myRows={myTeams}
          filters={[
            {type:'tab',
              values :R.map(x => x.sport_id, this.props.activeLeague.rules),
              column:'sport_id',
              allInd:true,
              sportInd:true,
              myOwnerName:ownerName,
              tabStyles:{backgroundColor:'#e3dac9',
                color:'#48311A',
                selectedBackgroundColor:'white', 
                selectedColor:'#229246',
                fontSize:16}
            },
            {type:'dropdown',
              values:confs,
              column:'conference',
              name:'Conference'
            },
            {type:'search',
              column:'team_name',
            },
          ]}
          orderInd={true}
          myHeaders = {[
            {label: 'Logo', key: 'logo_url', sortId:'team_name', imageInd:true},
            {label: 'Team Name', key: 'team_name'},
            {label: 'Sport', key: 'sport_id', imageInd:true},
            {label: 'Owner Name', key: 'owner_name'},
            {label: 'Conference', key: 'conference'},
            {label: 'Record', key: 'record', sortId:'percentage'},
            {label: 'Win Percentage', key: 'percentage'},
            // {label: 'Points', key: 'points'}
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
    teams: state.teams,
    activeLeague : state.activeLeague
  }),
  mapDispatchToProps,
)(withStyles(styles)(MainLeagueTeams))

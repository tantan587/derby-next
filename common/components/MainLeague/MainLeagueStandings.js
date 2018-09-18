import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import Title from '../Navigation/Title'
import StandingsSeasons from '../Standings/StandingsSeasons'
import StandingsRace from '../Standings/StandingsRace'
import OwnerSilk from '../Icons/Avatars/OwnerSilk'
import {clickedLeague} from '../../actions/fantasy-actions'
const R = require('ramda')

const styles = theme => ({
  container: {
    width: '94%',
    marginLeft: '3%',
    [theme.breakpoints.only('xs')]: {
      width: '100%',
      marginLeft: '0%',
    }
  },
  field: {
    textAlign: 'center',
  }
})

const styleProps = {
  Container:{
    overflowY:'hidden'
  },
  Table: {
    backgroundImage: 'url("/static/images/chalkboard.jpg")',
  },
  Header: {
    TableHead: {
      backgroundColor: 'transparent'
    },
    TableCell: {
      borderRight: '1px solid white',
      borderLeft: '1px solid white',
      fontWeight: 600
    }
  },
  Body: {
    TableBody: {
      color: 'white'
    },
    TableCell: (i, n) => ({
      color: 'white',
      backgroundColor: i === 1 && n.color,
      borderRight: '1px solid white',
      borderLeft: '1px solid white'
    }),
    TableCellComponent: (i, n) => i === 0 ? <td
      style={{ height: 80, width: 80, borderBottom: '1px solid white' }}>{OwnerSilk(n.avatar, {height:90})}</td> : false,
    TableRow: {
      borderRight: '1px solid white'
    }
  }
}

class MainLeagueStandings extends React.Component {

  componentWillMount(){
    this.props.onClickedLeague(this.props.activeLeague.league_id, this.props.user.id)
  }
  render() {
    const {classes, activeLeague} = this.props
    let owners = []
    if (activeLeague.owners)
      owners = this.props.activeLeague.owners
    let owners_race = owners.sort((a,b) => {
      return a.owner_name.toLowerCase() > b.owner_name.toLowerCase ? 1 : -1 
    }).map(x => x)
    let owners_table = owners.sort((a,b) => {return a.rank - b.rank})

    return(
      <div>
        <Title
          backgroundColor="#EBAB38"
          color="white"
          title="STANDINGS"
          subheading={this.props.activeLeague.league_name}
        />
        <div className={classes.container}>
          <StandingsSeasons />
          <StandingsRace
            owners={owners_race}
            seasons={this.props.activeLeague.seasons}
          />
        </div>
        <DerbyTableContainer
          noBreak
          usePagination={false}
          styleProps={styleProps}
          myRows={owners_table}
          myHeaders = {[
            {label: '', key: 'color'},
            {label: 'Rank', key: 'rank'},
            {label: 'Owner', key: 'owner_name'},
            {label: 'User', key: 'username'},
            {label: 'Points', key: 'total_points'},
            {label: 'Projected Points', key: 'total_projected_points'}
          ]}/>
      </div>
    )
  }
}

MainLeagueStandings.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default R.compose(
  connect(R.pick(['activeLeague', 'user']), {onClickedLeague: clickedLeague})
)(withStyles(styles)(MainLeagueStandings))

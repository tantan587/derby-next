import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import Title from '../Navigation/Title'
import StandingsSeasons from '../Standings/StandingsSeasons'
import StandingsRace from '../Standings/StandingsRace'
import OwnerSilk from '../Icons/Avatars/OwnerSilk'

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
  render() {
    let owners = []
    if (this.props.activeLeague.owners)
      owners = this.props.activeLeague.owners

    const dates = {
      season_start: new Date(Date.UTC(2017, 7, 1, 0, 0, 0)).getTime(),
      season_end: new Date(Date.UTC(2018, 9, 30, 0, 0, 0)).getTime(),
      current_time: new Date() //new Date(Date.UTC(2017, 8, 20, 0, 0, 0)).getTime()
    }
    console.log('DATES', dates)

    return(
      <div>
        <Title
          backgroundColor="#EBAB38"
          color="white"
          title="STANDINGS"
          subheading={this.props.activeLeague.league_name}
        />
        <div style={{ width: '94%', marginLeft: '3%' }}>
          
          <StandingsSeasons />
          <StandingsRace
            owners={owners}
            dates={dates}
          />
        </div>
        <DerbyTableContainer
          noBreak
          usePagination={false}
          styleProps={styleProps}
          myRows={owners}
          myHeaders = {[
            {label: '', key: 'color'},
            {label: 'Rank', key: 'rank'},
            {label: 'Owner', key: 'owner_name'},
            {label: 'User', key: 'username'},
            {label: 'Points', key: 'total_points'}
          ]}/>
      </div>
    )
  }
}

MainLeagueStandings.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      activeLeague : state.activeLeague,
    }),
  null
)(withStyles(styles)(MainLeagueStandings))

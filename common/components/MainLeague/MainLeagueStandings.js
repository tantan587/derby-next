import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import { connect } from 'react-redux'

import DerbyTableContainer from '../Table/DerbyTableContainer'
import Title from '../Navigation/Title'
import StandingsSeasons from '../Standings/StandingsSeasons'
import StandingsRace from '../Standings/StandingsRace'
import silksAndColors from '../../../data/silksAndColors'
import chooseSilk from '../Icons/Silks/silkUtil'

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
  Table: {
    backgroundImage: 'url("https://wallpapertag.com/wallpaper/full/3/a/b/270875-chalkboard-background-2400x1943-samsung-galaxy.jpg")',
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
    TableCellComponent: (i, n) => i === 0 ? chooseSilk(n) : false,
    TableRow: {
      borderRight: '1px solid white'
    }
  }
}

class MainLeagueStandings extends React.Component {
  render() {

    const ownersWithColors = this.props.activeLeague.owners
      .map((owner, i) => ({ ...owner, ...silksAndColors[i] }))

    const dates = {
      season_start: new Date(Date.UTC(2017, 7, 1, 0, 0, 0)).getTime(),
      season_end: new Date(Date.UTC(2018, 9, 30, 0, 0, 0)).getTime(),
      current_time: Date.now()
    }
    console.log('DATES', dates)

    return(
      <div>
        <div style={{ width: '92.7%', marginLeft: '3%' }}>
          <Title
            backgroundColor="#EBAB38"
            color="white"
            title="STANDINGS"
            subheading="League Name"
          />
          <StandingsSeasons />
          <StandingsRace
            owners={ownersWithColors}
            dates={dates}
          />
        </div>
        <DerbyTableContainer
          noBreak
          usePagination={false}
          styleProps={styleProps}
          myRows={ownersWithColors}
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

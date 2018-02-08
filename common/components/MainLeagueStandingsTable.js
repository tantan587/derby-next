import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import EnhancedTable from './EnhancedTable'

import { connect } from 'react-redux'

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

class MainLeagueStandingsTable extends React.Component {
  

  render() {
    return(<EnhancedTable
      title='League Standings'
      usePagination={false}
      myRows={this.props.activeLeague.owners}
      myHeaders = {[
        {label: 'Rank', key: 'rank'},
        {label: 'Owner', key: 'owner_name'},
        {label: 'User', key: 'username'},
        {label: 'Points', key: 'total_points'}
      ]}/>)
  }
}

MainLeagueStandingsTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      activeLeague : state.activeLeague,
    }),
  null
)(withStyles(styles)(MainLeagueStandingsTable))



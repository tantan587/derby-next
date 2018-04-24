import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import EnhancedTable from '../EnhancedTable'
import DerbyTableContainer from '../Table/DerbyTableContainer'

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

class MainLeagueStandings extends React.Component {
  
  constructor(props, context) {
    super(props, context)

    this.state = {
      myRows : []
    }
  }

  componentWillMount() {
    this.updateMyRows(this.props.activeLeague.owners)
  }
  
  componentWillReceiveProps(nextProps) {
    this.updateMyRows(nextProps.activeLeague.owners)
  }
  updateMyRows = (myRows) =>
  {
    this.setState({myRows:myRows})
  }



  render() {
    return(<DerbyTableContainer
      title='League Standings'
      usePagination={false}
      myRows={this.state.myRows}
      myHeaders = {[
        {label: 'Rank', key: 'rank'},
        {label: 'Owner', key: 'owner_name'},
        {label: 'User', key: 'username'},
        {label: 'Points', key: 'total_points'}
      ]}/>)
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



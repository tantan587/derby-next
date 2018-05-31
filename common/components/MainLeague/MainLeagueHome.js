import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { handleOpenDialog } from '../../actions/dialog-actions'
import DerbyTableContainer from '../Table/DerbyTableContainer'
import TeamsDialog from '../TeamsDialog/TeamsDialog'
import Title from '../Navigation/Title'


const styles = {
  section1: {
    textAlign: 'center',
    paddingTop: 100,
    color:'white',
    backgroundImage: 'url("/static/images/derbyhome2.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: '600px',
    marginLeft:'3%',
    width:'94%'
  },
}

class MainLeagueHome extends React.Component {


  render() {
    const {classes} = this.props
    return (
      <div>
        <Title color='white' backgroundColor='black' title={'Welcome Us'}/>
        <div className={classes.section1}/>
      </div>
    )
  }
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
)(withStyles(styles)(MainLeagueHome))

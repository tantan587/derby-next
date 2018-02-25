import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CircularProgress } from 'material-ui/Progress'
import { withStyles } from 'material-ui/styles'


const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.secondary[700],
    left:'50%',
    top:'30%',
    marginLeft:-25,
    marginTop:-25,
    position: 'absolute',
  },
})


class ReloadProtector extends React.Component {

  constructor(props, context) {
    super(props, context)
  }

  render () {

    const {ProtectedRoute, status, classes} = this.props

    if(!status.loaded)
    {
      return(<CircularProgress className={classes.progress} size={50} />)
    }
    else{
      return (
        <ProtectedRoute/>
      )
    }
  }
}

ReloadProtector.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(
  state =>
    ({
      status : state.status,
      user : state.user
    }),
  null)(withStyles(styles)(ReloadProtector))
const R = require('ramda')
import {connect} from 'react-redux'
import React, {Component} from 'react'
import autobind from 'react-autobind'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import {withStyles} from '@material-ui/core/styles'

import LayoutUser from '../common/components/LayoutUser'
import withRoot from '../common/components/withRoot'

const styles = {
  container: {
    padding: '20px',
  }
}

class AccountSettings extends Component {
  constructor(props) {
    super(props)
    autobind(this)
    this.state = {}
  }

  render() {
    return (
      <LayoutUser>
        <Grid
          container
          alignItems="center"
          justify="center"
          className={this.props.classes.container}
        >
          <div>I am account settings</div>
        </Grid>
      </LayoutUser>
    )
  }
}

export default R.compose(
  withRoot,
  withStyles(styles),
  connect(null, null),
)(AccountSettings)
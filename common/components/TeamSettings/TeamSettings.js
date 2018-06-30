import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import DerbyTabs from './Tabs/DerbyTabs'
import CustomizeTeam from './CustomizeTeam/CustomizeTeam'
import ManageEmails from './ManageEmails/ManageEmails'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 80
  },
  content: {
    width: '80%'
  },
  title: {
    fontFamily: 'HorsebackSlab',
    fontSize: 32,
    color: '#299149'
  }
}

const myTabs = [
  { label: 'Customize Team', Component: <CustomizeTeam /> },
  { label: 'Manage Emails', Component: <ManageEmails /> }
]

class TeamSettings extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.title}>Team Settings</div>
          <DerbyTabs tabsList={myTabs} />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(TeamSettings)

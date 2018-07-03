import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import DerbyTabs from '../Tabs/DerbyTabs'
import CustomizeTeam from './LeagueInfo/CustomizeTeam'
import ManageEmails from './ManageLeague/ManageEmails'

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
  { label: 'League Info & Draft', Component: <CustomizeTeam /> },
  { label: 'Manage League Members', Component: <ManageEmails /> }
]

class LeagueSettings extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.title}>League Settings</div>
          <DerbyTabs tabsList={myTabs} />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(LeagueSettings)

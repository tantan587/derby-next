import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import DerbyTabs from '../UI/DerbyTabs'
import CustomizeTeam from './CustomizeTeam/CustomizeTeam'
import ManageEmails from './ManageEmails/ManageEmails'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 80
  },
  content: {
    width: '80%',
    [theme.breakpoints.only('sm')]: {
      width: '85%'
    },
    [theme.breakpoints.only('xs')]: {
      width: '90%'
    },
  },
  title: {
    fontFamily: 'museo-slab-bold',
    fontSize: 32,
    color: '#299149'
  }
})

const myTabs = [
  { label: 'Customize Owner', Component: <CustomizeTeam /> },
  { label: 'Manage Emails', Component: <ManageEmails /> }
]

class TeamSettings extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.title}>OWNER SETTINGS</div>
          <DerbyTabs tabsList={myTabs} />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(TeamSettings)

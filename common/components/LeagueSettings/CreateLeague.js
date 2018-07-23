import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Title from '../Navigation/Title'
//import DerbyTabs from '../UI/DerbyTabs'
import LeagueInfo from './LeagueInfo/LeagueInfo'
//import ManageEmails from './ManageLeague/ManageEmails'

const styles = theme =>({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    //marginTop: 80
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
    fontFamily: 'HorsebackSlab',
    fontSize: 32,
    color: '#299149'
  }
})

// const myTabs = [
//   { label: 'League Info & Draft', Component: <LeagueInfo /> },
//   //{ label: 'Manage League Members', Component: <ManageEmails /> },
// ]

class LeagueSettings extends React.Component {

  render() {
    const { classes } = this.props

    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title='Create League'/>
        <div className={classes.root}>
          <div className={classes.content}>
            <LeagueInfo />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(LeagueSettings)

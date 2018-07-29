import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import CustomizeTeam from  '../TeamSettings/CustomizeTeam/CustomizeTeam' 
import Title from '../Navigation/Title'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 0
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
})


class TeamOptions extends React.Component {

  render() {
    const { classes, updatePage } = this.props

    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title='OWNER SETTINGS'/>
        <div className={classes.root}>
          <div className={classes.content}>
            <CustomizeTeam updatePage={updatePage}/>
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(TeamOptions)

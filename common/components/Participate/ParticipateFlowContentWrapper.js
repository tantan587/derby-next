import React from 'react'
import { withStyles } from '@material-ui/core/styles'
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


class ParticipateFlowWrapper extends React.Component {

  render() {
    const { classes, page, title} = this.props

    return (
      <div>
        <Title color='white' backgroundColor='#EBAB38' title={title}/>
        <div className={classes.root}>
          <div className={classes.content}>
            {page}
          </div>
        </div>
        <br/>
        <br/>
      </div>
    )
  }
}

export default withStyles(styles)(ParticipateFlowWrapper)

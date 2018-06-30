import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import StyledButton from '../../Navigation/Buttons/StyledButton'
import EmailCard from './EmailCard'

const styles = theme => ({
  root: {
    marginTop: 50,
    fontFamily: 'Roboto',
    color: '#717171'
  },
  grid: {
    marginTop: 50,
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center'
    },
  },
  reports: {
    fontFamily: 'HorsebackSlab',
    fontSize: 15,
    color: '#299149',
    marginBottom: 8
  }
})

class ManageEmails extends Component {
  state = {
    post: true,
    notifications: false
  }


  render() {
    const { classes } = this.props
    const { post, notifications } = this.state

    const reportsCopy = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    const postCopy = 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur'
    const notificationsCopy = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate'
    const noticesCopy = 'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in'

    return (
      <div className={classes.root}>
        <div>
          <div className={classes.reports}>Email Reports</div>
          <div>{reportsCopy}</div>
        </div>
        <Grid container wrap="wrap" className={classes.grid}>
          <Grid item sm={6} md={4} lg={3} className={classes.item}>
            <EmailCard
              title="The Post"
              copy={postCopy}
              check={post}
              label="Receive The Post?"
            />
          </Grid>
          <Grid item sm={6} md={4} lg={3} className={classes.item}>
            <EmailCard
              title="League Notifications"
              copy={notificationsCopy}
              check={notifications}
              label="Receive Notifications?"
            />
          </Grid>
          <Grid item sm={6} md={4} lg={3} className={classes.item}>
            <EmailCard
              title="Mandatory Notices"
              copy={noticesCopy}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(ManageEmails)

import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

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

    const reportsCopy = 'We may send you a few different types of emails. Here’s our promise to you: we won’t spam your inbox, and we won’t sell access to your email to third parties. You can toggle most of them on and off here. Some critical emails are required.'
    const postCopy = 'The Post is our review and preview of strategy tips, key games, and fun facts relating to Derby’s games. Occasionally, The Post may contain commercial offers via third-party partners that we think will improve your Derby experience. Once we launch it, we will send The Post approximately every Monday and Friday'
    const notificationsCopy = 'League Notifications are specific to you and your league mates and will contain information such as updates to your draft date and time, league renewal information, or other material your league commissioner may wish to send you. Though you should expect a few more notifications in between the time when you register for your league and when you draft, we strive to keep League Notifications to the minimum number needed to guide you through your Derby season'
    const noticesCopy = 'Sometimes, we are required by law to update you on changes to certain company policies. Sometimes we need to let you know of modifications to our services that require action on your part. As part of registration on our site, you consent to our right to send these emails when they are necessary. And we hope as much as you do that they are very rarely necessary'

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

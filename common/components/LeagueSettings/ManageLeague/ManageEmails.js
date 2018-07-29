import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import ManageTable from './ManageTable'
import ManageForm from './ManageForm'
import MemberList from './fakeMemberData'
import StyledButton from '../../Navigation/Buttons/StyledButton'

const styles = () => ({
  root: {
    marginTop: 50,
    fontFamily: 'Roboto',
    color: '#717171'
  },
  copy: {
    marginTop: 20,
    color: '#299149',
  },
  cardContainer: {
    marginTop: 50,
    display: 'flex',
    justifyContent: 'center'
  },
  reports: {
    fontFamily: 'HorsebackSlab',
    fontSize: 15,
    color: '#299149',
    marginBottom: 8
  },
})

class ManageEmails extends Component {

  onSubmit = () => {
    if(this.props.updatePage)
    {
      this.props.updatePage()
    }
  }

  render() {
    const { classes } = this.props
    
    const MEMBERS_AMOUNT = 10
    const modifiedMembers = MemberList.slice()
    modifiedMembers.length = MEMBERS_AMOUNT
    modifiedMembers.fill({}, MemberList.length)

    const inviteCopy = 'Invite members to join your league by adding their names to the Member List. Emailing them an invitation will send them a unique link and password along with instructions on how to join your league.'
    const settingsCopy = 'Your League is set for 10 Members. You can edit the number of league members in the "Basic League Settings" above.'

    return (
      <div className={classes.root}>
        <div>
          <div className={classes.reports}>Invite & Manage League Members</div>
          <div>{inviteCopy}</div>
        </div>
        <Card className={classes.cardContainer}>
          <Grid container spacing={32} style={{ width: '98%' }}>
            <Grid item xs={12}><div className={classes.copy}>{settingsCopy}</div></Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} className={classes.item}>
              <ManageForm />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} className={classes.item}>
              <ManageTable members={modifiedMembers} />
            </Grid>
          </Grid>
        </Card>
        <StyledButton
          height={50}
          styles={{ fontSize: 16, fontWeight: 600, marginTop: 40, marginBottom:50 }}
          text="Save Settings"
          onClick={this.onSubmit}
        />
      </div>
    )
  }
}

export default withStyles(styles)(ManageEmails)

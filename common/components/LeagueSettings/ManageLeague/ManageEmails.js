const R = require('ramda')
import { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import ManageTable from './ManageTable'
import ManageForm from './ManageForm'
import StyledButton from '../../Navigation/Buttons/StyledButton'

import {getInvites, createInvite, createInviteSignup, sendInvite, sendInviteBulk, deleteInvite, deleteInviteBulk, clearInviteError} from '../../../actions/invite-actions'

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

const resetSelectedInvites = () => ({selected_invites: {}})
const resetFormInvite = () => ({form: {email: ''}})

class ManageEmails extends Component {
  constructor(props) {
    super(props)
    this.state = R.merge(resetSelectedInvites(), resetFormInvite())
    this.onCheckboxChange = this.onCheckboxChange.bind(this)
    this.onEmailInviteClick = this.onEmailInviteClick.bind(this)
    this.onRemoveOwnerClick = this.onRemoveOwnerClick.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  componentDidMount() {
    this.props.getInvites(this.props.activeLeague.league_id)
  }

  onCheckboxChange(member) {
    // Toggling [invite id]: Boolean
    this.setState({selected_invites: {
      ...this.state.selected_invites,
      [member.invite_id]: this.state.selected_invites[member.invite_id] === undefined
        ? true
        : !this.state.selected_invites[member.invite_id]
    }})
  }

  onEmailInviteClick() {
    const selected_invites = R.keys(R.filter(R.equals(true), this.state.selected_invites))
    return this.props.sendInviteBulk(selected_invites)
    // selected_invites.map((invite_id) => this.props.sendInvite(invite_id).catch())
    // R.pipe(
    //   R.map(this.props.sendInvite),
    //   Promise.all.bind(Promise),
    // )(selected_invites)
    //   .then(() => this.setState(resetSelectedInvites))
  }

  onRemoveOwnerClick() {
    const selected_invites = R.keys(R.filter(R.equals(true), this.state.selected_invites))
    const emails = R.pipe(R.props(selected_invites), R.map(R.prop('email')))(this.props.invites.data)
    return this.props.deleteInviteBulk({emails, invite_ids: selected_invites})
      .then(() => {
        if (this.props.invites.error) {
          if (this.props.invites.error.code === 400) {
            this.props.clearInviteError()
            alert('You can not remove the commissioner (yourself) from the league.')
          }
        }
      })
  }

  onInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({form: {[name]: value}})
  }

  onFormSubmit(e) {
    e.preventDefault()
    const invitePayload = {...this.state.form, league_id: this.props.activeLeague.league_id}

    this.props.createInvite(invitePayload)
      .then(() => {
        if (this.props.invites.error) {
          if (this.props.invites.error.code === 400) {
            this.props.clearInviteError()
            this.onCreateInviteSignup(confirm('User is not currently registered. Do you want to send them an invite?'))  
          }
          if (this.props.invites.error && this.props.invites.error.code === 401) {
            this.props.clearInviteError()
            alert('User is already enrolled in league')
          }
        }
      })
  }

  onCreateInviteSignup = (shouldSendInvite) => {
    const invitePayload = {...this.state.form, league_id: this.props.activeLeague.league_id}
    if (shouldSendInvite) {
      this.props.createInviteSignup(invitePayload)
        .then(() => {
          if (this.props.invites.error) {
            if (this.props.invites.error.code === 422) {
              this.props.clearInviteError()
              alert('You have already invited this user.')
            }
          }
        })
    }
  }

  onSubmit = () => {
    if(this.props.updatePage) {
      this.props.updatePage()
    }
  }

  render() {
    const { classes, invites, activeLeague } = this.props
    const members = R.values(R.filter(R.propEq('league_id', activeLeague.league_id), (invites.data || {})))

    const inviteCopy = 'Invite members to join your league by adding their names to the Member List. Emailing them an invitation will send them a unique link and password along with instructions on how to join your league.'
    const settingsCopy = `Your League is set for ${activeLeague.max_owners} Members. 
    You can edit the number of league members in "Draft Info" tab above.`

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
              <ManageForm
                form={this.state.form}
                onInputChange={this.onInputChange}
                onFormSubmit={this.onFormSubmit}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} className={classes.item}>
              <ManageTable
                members={members}
                maxOwners={activeLeague.max_owners}
                selectedInvites={this.state.selected_invites}
                onCheckboxChange={this.onCheckboxChange}
                onEmailInviteClick={this.onEmailInviteClick}
                onRemoveOwnerClick={this.onRemoveOwnerClick}
              />
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

export default R.compose(
  withStyles(styles),
  connect(R.pick(['activeLeague', 'invites']), {
    getInvites,
    createInvite,
    createInviteSignup,
    sendInvite,
    sendInviteBulk,
    deleteInvite,
    deleteInviteBulk,
    clearInviteError,
  }),
)(ManageEmails)

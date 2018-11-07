const R = require('ramda')
import { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import ManageTable from './ManageTable'
import ManageForm from './ManageForm'
import StyledButton from '../../Navigation/Buttons/StyledButton'

import {getInvites, createInvite, sendInvite, deleteInvite} from '../../../actions/invite-actions'

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

    R.pipe(
      R.map(this.props.sendInvite),
      Promise.all.bind(Promise),
    )(selected_invites)
      .then(() => this.setState(resetSelectedInvites))
  }

  onRemoveOwnerClick() {
    const selected_invites = R.keys(R.filter(R.equals(true), this.state.selected_invites))
    R.pipe(
      R.map(this.props.deleteInvite),
      Promise.all.bind(Promise),
    )(selected_invites)
      .then(() => this.setState(resetSelectedInvites))
  }

  onInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({form: {[name]: value}})
  }

  onFormSubmit(e) {
    e.preventDefault()
    this.props.createInvite({
      ...this.state.form,
      league_id: this.props.activeLeague.league_id,
    })
    this.setState(resetFormInvite)
  }

  onSubmit = () => {
    if(this.props.updatePage)
    {
      this.props.updatePage()
    }
  }

  render() {
    const { classes, invites, activeLeague } = this.props
    const members = R.values(R.filter(R.propEq('league_id', activeLeague.league_id), (invites.data || {})))

    const inviteCopy = 'Invite members to join your league by adding their names to the Member List. Emailing them an invitation will send them a unique link and password along with instructions on how to join your league.'
    const settingsCopy = 'Your League is set for 10 Members. You can edit the number of league members in "Draft Info" tab above.'

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
    sendInvite,
    deleteInvite,
  }),
)(ManageEmails)

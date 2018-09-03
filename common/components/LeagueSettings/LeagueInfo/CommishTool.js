import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import {connect} from 'react-redux'
import {withRouter} from 'next/router'
import DraftSettings from './DraftSettings'
import ReorderDraft from './ReorderDraft'
import {clickedUpdateLeague, updateError} from '../../../actions/fantasy-actions'
import C from '../../../constants'
const R = require('ramda')
import StyledButton from '../../Navigation/Buttons/StyledButton'
import {handleReorderDraft} from '../../../actions/draft-actions'
import Link from 'next/link'

const styles = theme =>({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    //marginTop: 80
  },
  rootSmall: {
    marginTop: 50,
    fontFamily: 'Roboto',
    color: '#999999'
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
  gridMargins: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 30
    }
  },
  titleSmall: {
    marginBottom: 18,
    fontFamily: 'HorsebackSlab',
    fontSize: 15,
    color: '#299149'
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

class CommishTool extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      leagueInfo : 
        {
          draftType: 'Online - Snake Format',
          pickTime: props.activeLeague.draftInfo.seconds_pick,
          draftDate: props.activeLeague.draftInfo.start_time,

        },
      fireRedirect:false,
      owners:this.props.activeLeague.owners.sort((a,b) => {
        return a.draft_position > b.draft_position ? 1 : -1 })
    }
  }

  componentWillUnmount() {

    this.props.onUpdateError(C.PAGES.COMMISH_TOOLS, '')

  }

  setDeepState = (key, name, value) => {
    this.setState({
      [key]:{
        ...this.state[key],
        [name]: value,
      }
    })
  }

  handleChange = name => event => {

    let newValue = name === 'premier' ? event.target.checked : name === 'draftDate' ?  event : event.target.value

    this.setDeepState('leagueInfo', name, newValue)
    
  }

  onUpdateOrder= (start, end) => {
    let {owners} = this.state
    let newOwners = Array.from(owners)
    const [removed] = newOwners.splice(start, 1)
    newOwners.splice(end, 0, removed)
    this.setState({owners:newOwners})
  }

  getErrorText = () => 
  {
    const {leagueInfo} = this.state
    
    if (leagueInfo.draftDate - new Date() < 86400000)
      return 'Draft Date/Time must be at least 24 hours from now'
    return ''

  }

  onSubmit = () => {

    let errorText = this.getErrorText()
    if (errorText)
    {
      this.props.onUpdateError(C.PAGES.COMMISH_TOOLS, errorText)
    }
    else
    {
      this.setState({fireRedirect:true})
      this.props.onUpdateLeague(this.state.leagueInfo, this.props.activeLeague.league_id)
      this.props.onRedorderDraft(this.state.owners.map(x => x.owner_id),this.props.activeLeague.league_id)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.activeLeague && nextProps.activeLeague.draftInfo.start_time!==prevState.draftDate){
      return { draftDate:nextProps.activeLeague.draftInfo.start_time}
    }
    else return null
  }

  keypress(e) {
    if (e.key === 'Enter') { 
      this.props.onSubmit(e)
    }
  }

  render() {
    const { classes, user} = this.props
    const {leagueInfo, owners} = this.state
    const {draftType, pickTime, draftDate} = leagueInfo
    let errorText = user.error[C.PAGES.COMMISH_TOOLS]
    return (
      <div>
        
        <div className={classes.root}>
          <div className={classes.content}>
            <Grid container justify="space-between" className={classes.rootSmall} spacing={40} onKeyPress={(event) => this.keypress(event)}>
              <Grid item xs={12} md={12} lg={7} className={classes.gridMargins}>
                <div>
                  <div className={classes.titleSmall}>Draft Settings</div>
                  <DraftSettings draftType={draftType} pickTime={pickTime} draftDate={draftDate} handleChange={this.handleChange}/>
                </div>
              </Grid>
              <Grid item xs={12} md={12} lg={5} className={classes.gridMargins}>
                <div>
                  <div className={classes.titleSmall}>Reorder Draft</div>
                  <ReorderDraft owners={owners} onUpdateOrder={this.onUpdateOrder}/>
                </div>
              </Grid>
              <Grid item xs={12} md={12} lg={7} className={classes.gridMargins}>
                <div>
                  <div className={classes.titleSmall}>Invite League Members</div>
                  <Card>
                    <div  style={{margin:30}}>
                      <Typography variant='title' >
                        {'Inviting your friends to join your Derby league is as easy as 1-2-3!'}
                      </Typography>
                      <br/>
                      <Typography variant='subheading' >
                        {'1) Invite your friends to create an account on the '}
                        <Link href='/signup'><a>{'site'}</a></Link>
                      </Typography>
                      <br/>
                      <Typography variant='subheading'>
                        {'2) Email your friends your league name and league password'}
                      </Typography>
                      <br/>
                      <Typography variant='subheading'>
                        {'3) Ensure your friends sign up before the draft deadline'}
                      </Typography>
                    </div>
                  </Card>
                </div>
              </Grid>
              <Grid item xs={12} md={12} className={classes.gridMargins}>
                <Typography variant='subheading' style={{color:'red'}}>
                  {errorText}
                </Typography>
              </Grid>
              
              <StyledButton
                height={50}
                styles={{ fontSize: 16, fontWeight: 600, marginTop: errorText ? 16 : 40, marginBottom:50 }}
                text="Save Settings"
                onClick={this.onSubmit}
              />
              <br/>
              <br/>
            </Grid>
          </div>
        </div>
      </div>
    )
  }
}

export default R.compose(
  withRouter,
  withStyles(styles),
  connect(R.pick(['user', 'activeLeague']), 
    {onUpdateLeague: clickedUpdateLeague, onUpdateError: updateError, onRedorderDraft:handleReorderDraft}),
)(CommishTool)

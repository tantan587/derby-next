import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import io from 'socket.io-client'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Countdown from './Countdown'
import SimpleSnackbar from './SimpleSnackbar'
import DraftOrder from './DraftOrder'
import DraftQueue from './DraftQueue'
import CenteredTabs from './CenteredTabs'
import Title from '../Navigation/Title'
import {clickedEnterDraft,
  handleStartDraft,
  handleSetDraftMode,
  handleDraftPick,
  handleUpdateQueue,
  handleRecieveMessage} from '../../actions/draft-actions'
import { connect } from 'react-redux'
import Divider from '@material-ui/core/Divider'
import Chat from './Chat'
import Router from 'next/router'
import C from '../../constants'
import {clickedLeague} from '../../actions/fantasy-actions'


const styles = theme => ({
  container: {
    left: '50%',
    textAlign: 'center',
    marginTop : '100px'
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 0,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight:600,
  },
  button : {
    backgroundColor: theme.palette.secondary.A700,
    color: theme.palette.secondary.A100,
  }
})

class DraftContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      countdownTime:0,
      startTime:0,
      snackbarOpen:false,
      snackbarMessage:'',
      myDraftPosition:-1,
      ownerMap:{},
      sawPickError:false,
      sockets:['whoshere', 'people','message','start','reset',
        'startTick','draftTick', 'draftTeam', 'modechange', 'queueResp', 'rollback'],
      functions : [this.handleWhosHere, this.handlePeople,this.handleMessage,
        this.handleStart, this.handleReset,
        this.handleStartTick, this.handleDraftTick, this.handleDraftTeam,
        this.handleModeChange, this.handleQueueResp, this.handleRollback]
    }
  }

  componentWillMount() {
    this.props.onEnterDraft(
      this.props.activeLeague.room_id, this.props.activeLeague.my_owner_id)
    this.props.onClickedLeague(this.props.activeLeague.league_id, this.props.user.id)
  }
  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io('/draft')
    this.socket.on('connect', () => {
      // Connected, let's sign-up for to receive messages for this room
      this.socket.emit('join', 
        {roomId: this.props.activeLeague.room_id, 
          owner_id:this.props.activeLeague.my_owner_id })
    })
    this.state.sockets.map((socket,i) => 
      this.socket.on(socket, this.state.functions[i]))
    let myDraftPosition =-1
    const ownerMap = {}
    this.props.activeLeague.owners.map(owner => {
      let here = false

      if(owner.owner_id === this.props.activeLeague.my_owner_id)
      {
        here = true
        myDraftPosition = owner.draft_position
      }
      ownerMap[owner.owner_id] =
       {draft_position:owner.draft_position, 
         owner_name:owner.owner_name,
         here:here,
         avatar:owner.avatar}
    })
    this.setState({ownerMap:ownerMap, myDraftPosition:myDraftPosition})
  }

  componentWillUnmount() {
    this.state.sockets.map((socket,i) => 
      this.socket.off(socket, this.state.functions[i]))
    this.socket.close()
  }

  handleWhosHere = () =>
  {
    this.socket.emit('imhere', this.props.activeLeague.my_owner_id)
  }

  handlePeople = (owner) => {
    const ownerMap = this.state.ownerMap

    if(owner.state === 'joined')
    {
      owner.owners.map(owner_id =>
        ownerMap[owner_id].here = true
      )
    }
    else{
      ownerMap[owner.owner_id].here = false
    }
    const snackbarMessage = this.props.activeLeague.my_owner_id === owner.owner_id 
      ? 'You just ' + owner.state
      : ownerMap[owner.owner_id].owner_name + ' has ' + owner.state
    this.setState(
      {snackbarOpen:true, 
        ownerMap:ownerMap, 
        snackbarMessage:snackbarMessage
      })
  }

  // add messages from server to the state
  handleMessage = (data) => {
    this.props.onRecieveMessage(data)
  }

  handleReset = () => {
    this.props.onSetDraftMode('pre')
    this.setState({ 
      startTime:0})
  }

  handleStart =() => {
    this.props.onSetUpdateQueue(this.props.draft.queue)
    this.props.onStartDraft()
  }

  handleStartTick = (newTime) => {
    this.setState({ startTime: Math.floor(newTime.counter/1000) })
  }

  handleModeChange = (mode) => {
    this.props.onSetDraftMode(mode)
    if (mode === C.DRAFT_STATE.POST)
    {
      this.props.onClickedLeague(this.props.activeLeague.league_id,  this.props.user.id) 
    }
  }

  handleDraftTick = (data) => {

    let sawPickError = false
    if (this.props.draft.pick !== data.pick)
    {
      if(this.state.sawPickError)
      {
        Router.push('/livedraft')
      }
      else
      {
        sawPickError = true
      }
    }
    this.setState({countdownTime: data.counter, sawPickError})
    
      
  }

  onDraftButton = (teamId) => {
    const {activeLeague, draft} = this.props
    const myTurn = this.state.myDraftPosition ===
      activeLeague.draftOrder[draft.pick].ownerIndex
    if(this.props.draft.mode ==='live' && 
    (this.props.draft.queue.length > 0 || teamId) && myTurn)
      this.socket.emit('draft', 
        {teamId: teamId ? teamId : draft.queue[0],
          clientTs:new Date()
        })
  }

  handleDraftTeam = (data) => {
    const myOwnerId = this.props.activeLeague.my_owner_id
    const thisIsMe = myOwnerId === data.ownerId
    if(data)
    {
      let queue =  this.props.draft.queue
      const index =queue.indexOf(data.teamId)
      if(index > -1 && !thisIsMe)
      {
        queue.splice(index, 1)
        this.socket.emit('queue',
          {queue:queue, ownerId:myOwnerId})
        this.props.onSetUpdateQueue(queue)
      }
    }
    const teamName =  this.props.teams[data.teamId].team_name
    const sport = this.props.teams[data.teamId].sport
    const snackbarMessage = thisIsMe
      ? 'You just drafted the ' + teamName + ' (' + sport+ ')'
      : this.state.ownerMap[data.ownerId].owner_name + ' just drafted the ' + teamName + ' (' + sport+ ')'

    this.setState({snackbarMessage:snackbarMessage, snackbarOpen:true})
    data['thisIsMe'] = thisIsMe
    this.props.onDraftPick(data)      
  }

  handleRollback = (data) => {
    console.log(data)
    // const myOwnerId = this.props.activeLeague.my_owner_id
    // const thisIsMe = myOwnerId === data.ownerId
    // if(data)
    // {
    //   let queue =  this.props.draft.queue
    //   const index =queue.indexOf(data.teamId)
    //   if(index > -1 && !thisIsMe)
    //   {
    //     queue.splice(index, 1)
    //     this.socket.emit('queue',
    //       {queue:queue, ownerId:myOwnerId})
    //     this.props.onSetUpdateQueue(queue)
    //   }
    // }
    // const teamName =  this.props.teams[data.teamId].team_name
    // const sport = this.props.teams[data.teamId].sport
    // const snackbarMessage = thisIsMe
    //   ? 'You just drafted the ' + teamName + ' (' + sport+ ')'
    //   : this.state.ownerMap[data.ownerId].owner_name + ' just drafted the ' + teamName + ' (' + sport+ ')'

    // this.setState({snackbarMessage:snackbarMessage, snackbarOpen:true})
    // data['thisIsMe'] = thisIsMe
    // this.props.onDraftPick(data)      
  }

  onUpdateQueue = (newQueue) => {
    this.socket.emit('queue', 
      {queue:newQueue, ownerId:this.props.activeLeague.my_owner_id})
    this.props.onSetUpdateQueue(newQueue)
  }

  handleQueueResp = (payload) =>{
    if(payload.ownerId === this.props.activeLeague.my_owner_id)
    {
      if(payload.success)
        this.props.onSetUpdateQueue(payload.queue)
      else
        this.setState({snackbarMessage:
          'You can\'t queue the ' + this.props.teams[parseInt(payload.teamId)].team_name, 
        snackbarOpen:true})
    }
  }

  onAddQueue = (item) => {
    if( !this.props.draft.queue.includes(item))
      this.socket.emit('addqueue',
        {teamId:item, 
          ownerId:this.props.activeLeague.my_owner_id, 
          queue:this.props.draft.queue})
  }

  // send messages to server and add them to the state
  onMessageSubmit = message => {
    const payload = {
      clientTs: (new Date()).toJSON(),
      message: message,
    }
    this.socket.emit('message', payload)
  }

  onTimeToDraftChange = event => {
    if(event.target.value > 0)
      this.socket.emit('timeToDraft',event.target.value)
  }

  onRestartDraft = () => {
    this.socket.emit('restartDraft')
  }

  onRollbackPreviousPick = () => {
    this.socket.emit('tryRollback')
  }

  onTimeout = () => {
    this.socket.emit('timeout')
  }

  onTimeIn = () => {
    this.socket.emit('timein')
  }
  
  onUpdateLinesToShow = event => {
    this.setState({linesToShow:event.target.value})
  }

  onSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ snackbarOpen: false })
  }

  render() {
    const { classes, activeLeague ,draft, teams, user } = this.props
    const {countdownTime, startTime,
      snackbarOpen,snackbarMessage, ownerMap} = this.state
    
    
    const currDraftPick = draft.pick ? draft.pick : 0

    const myTurn = activeLeague.draftOrder[currDraftPick] && this.state.myDraftPosition ===
      activeLeague.draftOrder[currDraftPick].ownerIndex

    const allowDraft = draft.mode==='live' && myTurn 

    return (

      <div className={classes.root}>
        <Title backgroundColor='#EBAB38' color='white' title={'Live Draft - ' + activeLeague.league_name }/>
        <Grid container spacing={24} >
          <Grid item xs={12}>
            <div className={classes.paper}>
              <Grid container alignItems={'stretch'} direction='row' style={{height:'100%'}}>
                <Grid item xs={12} sm={2} 
                  style={{backgroundColor:'black'}}>
                  <Grid container direction={'column'}>
                    <Grid item xs={12} style={{backgroundColor:'black'}}>
                      <Countdown 
                        countdownTime={countdownTime}
                        startTime={startTime}
                        mode={draft.mode}/>
                    </Grid>
                    <Grid item xs={12}>
                      <DraftOrder 
                        owners={Object.values(ownerMap)}
                        myOwnerName={ ownerMap[activeLeague.my_owner_id]  ? ownerMap[activeLeague.my_owner_id].owner_name : ''}  
                        draftOrder={activeLeague.draftOrder}
                        currPick={draft.pick}
                        mode={draft.mode}/>
                    </Grid>
                    <Divider style={{backgroundColor:'white'}}/>
                  </Grid>

                </Grid>
                <Grid item xs={12} sm={8} style={{backgroundColor:'white'}}>
                  <Grid container direction={'column'}>
                    <Grid item xs={12}>
                      <Grid item xs={12}>
                        <Divider style={{backgroundColor:'white'}}/>
                      </Grid>
                      <CenteredTabs
                        onUpdateQueue={this.onUpdateQueue}
                        onAddQueue={this.onAddQueue}
                        onDraftButton={this.onDraftButton}
                        allowDraft={allowDraft}/>
                    </Grid>
                    {
                      user.admin || activeLeague.imTheCommish ?
                        <div>
                          <Button onClick={draft.mode === 'timeout' ? 
                            this.onTimeIn : 
                            draft.mode ==='live' ? 
                              this.onTimeout : null}>
                            {draft.mode === 'timeout' ? 'Continue' : 'Pause'}
                          </Button>
                          <Button onClick={this.onRestartDraft}>
                            {'Restart Draft'}
                          </Button>
                          <Button disabled={draft.mode !== 'timeout' || draft.pick === 0} onClick={this.onRollbackPreviousPick}>
                            {'Roll Back Previous Pick'}
                          </Button>
                          {
                            user.admin ? 
                              <form  noValidate>
                                <TextField
                                  id="number"
                                  label="Draft Time (secs)"
                                  onChange={this.onTimeToDraftChange}
                                  type="number"
                                  defaultValue={activeLeague.draftInfo.seconds_pick}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </form> : null
                          }
                        </div>
                        : null
                    }
                    
                    <Grid item xs={12} style={{backgroundColor:'white'}} >
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={2}  style={{backgroundColor:'black'}}>
                  <Grid item xs={12} style={{backgroundColor:'black'}}>
                    <Typography key={'head'} variant='subheading' 
                      style={{fontFamily:'HorsebackSlab', color:'white', 
                        paddingTop:15, paddingBottom:15}}>
                        Draft Queue
                    </Typography>
                    <Divider style={{backgroundColor:'white'}}/>
                  </Grid>
                  <Grid container direction={'column'} style={{backgroundColor:'black'}}>
                    <Grid item xs={12}>
                      <DraftQueue  items={draft.queue} teams={teams} updateOrder={this.onUpdateQueue}/>
                    </Grid>
                    <Grid item xs={12} style={{marginBottom:5}}>
                      <Button
                        disabled={!allowDraft} 
                        style={{fontSize:14, 
                          backgroundColor:allowDraft ? '#EBAB38' : '#b2b2b2',
                          fontStyle:allowDraft ? 'normal' : 'italic',
                          marginTop:10, color:'white', width:'90%'}} 
                        onClick={() => this.onDraftButton()}>
                        DRAFT #1 TEAM
                      </Button>
                    </Grid>
                    <Divider style={{backgroundColor:'white'}}/>
                    <Grid item xs={12}>
                      <div style={{height:300, maxHeight:300}}>
                        <div style={{color:'white'}}>
                          
                          {/* //viewBox="0 -10 24 34" style={{width:24,height:34}}/> */}
                        </div>
                        <img src={'/static/icons/Derby_Chat_Bubble.svg'} viewBox="0 -10 24 64" style={{marginTop:5, width:24,height:20}}/>
                        <Typography key={'head'} variant='subheading' 
                          style={{fontFamily:'HorsebackSlab', color:'white',marginTop:-0,
                            paddingTop:0, paddingBottom:0, marginLeft:10,display:'inline-block'}}>
                            Chat
                        </Typography>
                        <Chat onMessageSubmit={this.onMessageSubmit}/>
                      </div>
                    </Grid>
                    
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <SimpleSnackbar open={snackbarOpen} message={snackbarMessage} handleClose={this.onSnackbarClose}/>  
        <br/>
        <br/>  
        <br/>
        <br/>  
      </div>
    )
  }
}

DraftContainer.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default connect(
  state =>
    ({
      user : state.user,
      activeLeague : state.activeLeague,
      draft : state.draft,
      teams:state.teams
    }),
  dispatch =>
    ({
      onEnterDraft(room_id, owner_id) {
        dispatch(
          clickedEnterDraft(room_id, owner_id))
      },
      onStartDraft() {
        dispatch(
          handleStartDraft())
      },
      onSetDraftMode(mode) {
        dispatch(
          handleSetDraftMode(mode))
      },
      onDraftPick(data) {
        dispatch(
          handleDraftPick(data))
      },
      onSetUpdateQueue(queue) {
        dispatch(
          handleUpdateQueue(queue))
      },
      onRecieveMessage(message) {
        dispatch(
          handleRecieveMessage(message))
      },
      onClickedLeague(league_id, user_id) {
        dispatch(
          clickedLeague(league_id, user_id))
      },
    }))(withStyles(styles)(DraftContainer))
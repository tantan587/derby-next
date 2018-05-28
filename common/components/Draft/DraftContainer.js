import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import io from 'socket.io-client'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Countdown from './Countdown'
import DraftHeader from './DraftHeader'
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
import Divider from 'material-ui/Divider'
import Chat from './Chat'

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
      preDraft:true,
      countdownTime:0,
      startTime:Math.round((new Date(this.props.activeLeague.draft_start_time)-new Date())/1000),
      snackbarOpen:false,
      snackbarMessage:'',
      myDraftPosition:-1,
      ownerMap:{},
      sockets:['whoshere', 'people','message','start','reset',
        'startTick','draftTick', 'draftInfo', 'modechange', 'addqueueresp'],
      functions : [this.handleWhosHere, this.handlePeople,this.handleMessage,
        this.handleStart, this.handleReset,
        this.handleStartTick, this.handleDraftTick, this.handleDraftInfo,
        this.handleModeChange, this.handleAddQueueResponse]
    }
  }

  componentWillMount() {
    this.props.onEnterDraft(
      this.props.activeLeague.room_id, this.props.activeLeague.my_owner_id)
  }
  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io()
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
         here:here}
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
  handleMessage = (message) => {
    this.props.onRecieveMessage(message)
  }

  handleReset = (data) => {
    this.props.onSetDraftMode('pre')
    this.setState({ 
      startTime:Math.round((new Date(data.draftStartTime)-new Date())/1000) })
  }

  handleStart =() => {
    this.props.onSetUpdateQueue(this.props.draft.queue)
    this.props.onStartDraft()
  }

  handleStartTick = () => {
    if(this.state.startTime < 5 && this.props.draft.mode ==='pre')
    {
      this.props.onSetDraftMode('wait')
    }
    if(this.state.startTime > 0)
    {
      this.setState({ startTime: this.state.startTime -1 })
    }
  }

  handleModeChange = (mode) => {
    this.props.onSetDraftMode(mode)
  }

  handleDraftTick = (counter) => {
    this.setState({countdownTime: counter})
      
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

  handleDraftInfo = (data) => {
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

  onUpdateQueue = (newQueue) => {
    this.socket.emit('queue', 
      {queue:newQueue, ownerId:this.props.activeLeague.my_owner_id})
    this.props.onSetUpdateQueue(newQueue)
  }

  handleAddQueueResponse = (payload) =>{
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

  enterDraft()
  {
    this.setState({preDraft:false})
  }

  render() {
    const { classes, activeLeague ,draft, teams } = this.props
    const { preDraft, countdownTime, startTime,
      snackbarOpen,snackbarMessage, ownerMap} = this.state
    
    
    const currDraftPick = draft.pick ? draft.pick : 0

    const myTurn = activeLeague.draftOrder[currDraftPick] && this.state.myDraftPosition ===
      activeLeague.draftOrder[currDraftPick].ownerIndex

    const allowDraft = draft.mode==='live' && myTurn 

    return (

      preDraft
        ?
        <form className={classes.container}>
          <Typography variant="subheading" className={classes.text} gutterBottom>
            {'Some text explaining about the draft'}
          </Typography>
          <Button className={classes.button} onClick={() => this.enterDraft()}>
            Enter Draft
          </Button>
        </form>
        :
        <div className={classes.root}>
          <Title backgroundColor='#EBAB38' color='white' title={'Live Draft - ' + activeLeague.league_name }/>
          <Grid container spacing={24} >
            <Grid item xs={12}>
              <Paper className={classes.paper}>
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
                          myOwnerName={ownerMap[activeLeague.my_owner_id].owner_name}  
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
                          {/* <DraftHeader 
                            startTime={startTime} 
                            mode={draft.mode}
                            myTurn={myTurn}/> */}
                          <Divider style={{backgroundColor:'white'}}/>
                        </Grid>
                        <CenteredTabs
                          onUpdateQueue={this.onUpdateQueue}
                          onAddQueue={this.onAddQueue}
                          onDraftButton={this.onDraftButton}
                          allowDraft={allowDraft}/>
                      </Grid>
                      <Button onClick={draft.mode === 'timeout' ? 
                        this.onTimeIn : 
                        draft.mode ==='live' ? 
                          this.onTimeout : null}>
                        {draft.mode === 'timeout' ? 'Continue' : 'Pause'}
                      </Button>
                      <Button onClick={this.onRestartDraft}>
                        {'Restart Draft'}
                      </Button>
                      <form  noValidate>
                        <TextField
                          id="number"
                          label="Draft Time (secs)"
                          onChange={this.onTimeToDraftChange}
                          type="number"
                          defaultValue="5"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </form>
                      
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
                            marginTop:10, marginLeft:'-5%', color:'white', width:'90%'}} 
                          onClick={() => this.onDraftButton()}>
                          DRAFT #1 TEAM
                        </Button>
                      </Grid>
                      <Divider style={{backgroundColor:'white'}}/>
                      <Grid item xs={12}>
                        <div style={{height:350, maxHeight:350}}>
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
                      <Divider style={{backgroundColor:'white'}}/>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <SimpleSnackbar open={snackbarOpen} message={snackbarMessage} handleClose={this.onSnackbarClose}/>    
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
    }))(withStyles(styles)(DraftContainer))
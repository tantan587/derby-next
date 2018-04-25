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
  handleUpdateQueue} from '../../actions/draft-actions'
import { connect } from 'react-redux'

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
    minHeight:600
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
      field: '',
      preDraft:true,
      messages:[],
      countdownTime:0,
      startTime:Math.round((new Date(this.props.activeLeague.draft_start_time)-new Date())/1000),
      snackbarOpen:false,
      snackbarMessage:'',
      linesToShow:20,
      myDraftPosition:-1,
      ownerMap:{},
      sockets:['whoshere', 'people','message','start','reset',
        'startTick','draftTick', 'draftInfo'],
      functions : [this.handleWhosHere, this.handlePeople,this.handleMessage,
        this.handleStart, this.handleReset,
        this.handleStartTick, this.handleDraftTick, this.handleDraftInfo]
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
    message.c2id = (new Date()).getTime()
    this.setState(state => ({ messages: state.messages.concat(message) }))
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

  handleDraftTick = (counter) => {

    this.setState({countdownTime: counter})
      
  }
  onTextChange = event => {
    this.setState({ field: event.target.value })
  }


  onDraftButton = () => {
    const {activeLeague, draft} = this.props
    const myTurn = this.state.myDraftPosition ===
      activeLeague.draftOrder[draft.pick].ownerIndex
    if(this.props.draft.mode ==='live' && 
    this.props.draft.queue.length > 0 && myTurn)
      this.socket.emit('draft', 
        {teamId: draft.queue[0],
          clientTs:new Date()
        })
  }

  handleDraftInfo = (data) => {
    console.log(data)
    if(data)
    {
      let queue =  this.props.draft.queue
      const index =queue.indexOf(data.teamId)
      if(index > -1)
      {
        queue.splice(index, 1)
        this.socket.emit('queue',
          {queue:queue, ownerId:this.props.activeLeague.my_owner_id})
        this.props.onSetUpdateQueue(queue)
      }
    }
    const teamName =  this.props.teams[data.teamId].team_name
    const snackbarMessage = this.props.activeLeague.my_owner_id === data.ownerId 
      ? 'You just drafted the ' + teamName
      : this.state.ownerMap[data.ownerId].owner_name + ' just drafted the ' + teamName

    this.setState({snackbarMessage:snackbarMessage, snackbarOpen:true})

    this.props.onDraftPick(data)      
  }

  onUpdateQueue = (newQueue) => {
    this.socket.emit('queue', 
      {queue:newQueue, ownerId:this.props.activeLeague.my_owner_id})
    this.props.onSetUpdateQueue(newQueue)
  }

  onAddQueue = (item) => {
    const newQueue = Array.from(this.props.draft.queue)
    newQueue.push(item)
    this.socket.emit('queue',
      {queue:newQueue, ownerId:this.props.activeLeague.my_owner_id})
    this.props.onSetUpdateQueue(newQueue)
  }

  // send messages to server and add them to the state
  onSubmit = event => {
    event.preventDefault()

    // create message object
    const message = {
      cid: (new Date()).getTime(),
      value: this.state.field,
    }

    // send object to WS server
    this.socket.emit('message', message)

    // add it to state and clean current input value
    this.setState(state => ({
      field: '',
      //messages: state.messages.concat(message)
    }))
  }

  onStartTimeChange = event => {
    this.socket.emit('startTime',event.target.value)
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
      snackbarOpen,snackbarMessage, ownerMap, linesToShow} = this.state

    const currDraftPick = draft.pick ? draft.pick : 0

    const myTurn = this.state.myDraftPosition ===
      activeLeague.draftOrder[currDraftPick].ownerIndex

    const dataForTeams = {}
    dataForTeams.addToQueue=this.onAddQueue
    dataForTeams.teams=teams
    dataForTeams.availableTeams=draft.availableTeams
    dataForTeams.queue=draft.queue
    dataForTeams.linesToShow=linesToShow
    return (

      preDraft
        ?
        <form className={classes.container}>
          <Typography type="subheading" className={classes.text} gutterBottom>
            {'Some text explaining about the draft'}
          </Typography>
          <Button raised className={classes.button} onClick={() => this.enterDraft()}>
            Enter Draft
          </Button>
        </form>
        :
        <div className={classes.root}>
          <Title backgroundColor='#EBAB38' color='white' title='Live Draft'/>
          <Grid container spacing={24} >
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container alignItems={'stretch'} direction='row'>
                  <Grid item xs={12} sm={2} 
                    style={{backgroundColor:'white'}}>
                    <Grid container direction={'column'}>
                      <Grid item xs={12} style={{backgroundColor:'black'}}>
                        <Countdown 
                          countdownTime={countdownTime}/>
                      </Grid>
                      <Grid item xs={12}>
                        <DraftOrder 
                          owners={Object.values(ownerMap)}
                          myOwnerName={ownerMap[activeLeague.my_owner_id].owner_name}  
                          draftOrder={activeLeague.draftOrder}
                          currPick={draft.pick}/>
                      </Grid>
                    </Grid>

                  </Grid>
                  <Grid item xs={12} sm={8} style={{backgroundColor:'white'}}>
                    <Grid container direction={'column'}>
                      <Grid item xs={12} style={{backgroundColor:'white'}} >
                        <DraftHeader 
                          startTime={startTime} 
                          league_name={activeLeague.league_name} 
                          mode={draft.mode}
                          myTurn={myTurn}/>
                      </Grid>
                      <Grid item xs={12}>

                        <CenteredTabs
                          dataForTeams={dataForTeams}/>
                      </Grid>
                      <form  noValidate>
                        <TextField
                          id="number1"
                          label="Rows Tow Show"
                          onChange={this.onUpdateLinesToShow}
                          type="number"
                          defaultValue="20"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </form>
                      <form  noValidate>
                        <TextField
                          id="number"
                          label="Start Time (secs)"
                          onChange={this.onStartTimeChange}
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
                  <Grid item xs={12} sm={2} style={{backgroundColor:'white'}}>
                    <Grid container direction={'column'}>
                      <Grid item xs={12} style={{backgroundColor:'white'}} >
                        <Button style={{fontSize:30, backgroundColor:'orange'}} 
                          onClick={() => this.onDraftButton()}>
                          Draft
                        </Button>
                      </Grid>
                      <Grid item xs={12} style={{backgroundColor:'white'}} >
                        <DraftQueue  items={draft.queue} teams={teams} updateOrder={this.onUpdateQueue}/>
                      </Grid>
                    </Grid>
                    
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <div>
            <ul>
              {this.state.messages.map(message =>
                <li key={message.c2id}>{
                  's-c: '+ (message.sid - message.cid).toString() + 
                  ' c2-c: '+ (message.c2id - message.cid).toString() + ' ' + message.value}</li>
              )}
            </ul>
            <form onSubmit={this.onSubmit}>
              <input
                onChange={this.onTextChange}
                type="text"
                placeholder="Hello world!"
                value={this.state.field}/>
              <button>Send</button>
            </form>
          </div>
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
    }))(withStyles(styles)(DraftContainer))
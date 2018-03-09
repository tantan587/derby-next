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
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight:800
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
      draftState:'pre',
      messages:[],
      countdownTime:0,
      countdownTimerId:0,
      isOn:false,
      isPaused:true,
      startTime:Math.round((new Date(this.props.activeLeague.draft_start_time)-new Date())/1000),
      startTimerId:0,
      snackbarOpen:false,
      snackbarMessage:'',
      ownerMap:{},
      currPick:0,
    }
  }

  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io()
    this.socket.on('connect', () => {
      // Connected, let's sign-up for to receive messages for this room
      this.socket.emit('join', 
        {roomName: this.props.activeLeague.room_id, 
          owner_id:this.props.activeLeague.my_owner_id })
    })
    this.socket.on('people', this.handlePeople)
    this.socket.on('message', this.handleMessage)
    this.socket.on('start', this.handleStart)
    this.socket.on('stop', this.handleStop)
    this.socket.on('restart', this.handleRestart)
    this.socket.on('reset', this.handleReset)

    const ownerMap = {}
    this.props.activeLeague.owners.map(owner => {
      const here = owner.owner_id === this.props.activeLeague.my_owner_id
      ownerMap[owner.owner_id] =
       {draft_position:owner.draft_position, 
         owner_name:owner.owner_name,
         here:here}
    })
    console.log(ownerMap)
    this.setState({ownerMap:ownerMap})
  }

  componentWillUnmount() {
    this.socket.emit('leave', this.props.activeLeague.my_owner_id)
    this.socket.off('people', this.handlePeople)
    this.socket.off('message', this.handleMessage)
    this.socket.off('start', this.handleStart)
    this.socket.off('stop', this.handleStop)
    this.socket.off('restart', this.handleRestart)
    this.socket.off('reset', this.handleReset)
    this.socket.close()
  }

  handlePeople = (owner) => {
    const ownerMap = this.state.ownerMap

    console.log(owner)

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

  handleRestart = (data) => {
    console.log('restart')
    this.setState({ countdownTime:data.clock,isOn:false })
  }

  handleReset = (data) => {
    this.setState({ 
      draftState:'pre',
      startTime:Math.round((new Date(data.draftStartTime)-new Date())/1000) })
  }

  handleStop =() => {
    this.setState({ isPaused:true })
  }

  handleStart =() => {
    console.log('start')
    this.setState({ isPaused:false, draftState:'live', currPick:0 })
  }

  handleChange = event => {
    this.setState({ field: event.target.value })
  }

  updateTimerId = (name, timerId) =>
  {
    console.log('udpateTimer')
    this.setState({
      [name]: timerId,
    })
  }

  onDraftTick = () => {
    const {countdownTime, isPaused} = this.state
    if(!isPaused)
    {
      if(countdownTime > 0)
      {this.setState(() => ({ countdownTime: countdownTime -1, isOn:true }))}
      else if(this.state.isOn=== true)
      {this.setState(() => ({ isOn:false }))}
      
    }
  }

  onStartTick = () => {
    if(this.state.startTime < 5 && this.state.draftState ==='pre')
    {
      this.setState({ draftState: 'wait' })
    }
    if(this.state.startTime > 0)
    {
      this.setState({ startTime: this.state.startTime -1 })
    }
    
  }

  handleStartTime = event => {
    this.socket.emit('startTime',event.target.value)
  }

  onDraftButton = () => {
    this.socket.emit('draft')
    this.setState({currPick:this.state.currPick+1})
  }

  // send messages to server and add them to the state
  handleSubmit = event => {
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

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbarOpen: false })
  };

  enterDraft()
  {
    this.setState({preDraft:false})

  }

  render() {
    const { classes, activeLeague } = this.props
    const { preDraft, countdownTime, countdownTimerId,
      isOn, isPaused, startTime,startTimerId, draftState,
      snackbarOpen,snackbarMessage, ownerMap, currPick } = this.state
    // const teams = [1,2,3,4,5]
    // const queueTeams = []
    // teams.map(num => queueTeams.push({id:num,text:num,order:num }))

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
          <Grid container spacing={24} >
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container alignItems={'stretch'} direction='row'>
                  <Grid item xs={12} sm={2} 
                    style={{backgroundColor:'white'}}>
                    <Grid container direction={'column'}>
                      <Grid item xs={12} style={{backgroundColor:'yellow'}}>
                        <Countdown 
                          countdownTime={countdownTime}  
                          isOn={isOn} 
                          isPaused={isPaused} 
                          onTick={this.onDraftTick}
                          countdownTimerId={countdownTimerId}
                          updateTimerId={this.updateTimerId}/>
                      </Grid>
                      <Grid item xs={12}>
                        <DraftOrder 
                          owners={Object.values(ownerMap)}
                          myOwnerName={ownerMap[activeLeague.my_owner_id].owner_name}  
                          totalTeams={activeLeague.total_teams}
                          currPick={currPick}/>
                      </Grid>
                    </Grid>

                  </Grid>
                  <Grid item xs={12} sm={8} style={{backgroundColor:'white'}}>
                    <Grid container direction={'column'}>
                      <Grid item xs={12} style={{backgroundColor:'white'}} >
                        <DraftHeader 
                          startTime={startTime} 
                          league_name={activeLeague.league_name} 
                          draftState={draftState} 
                          onTick={this.onStartTick}
                          startTimerId={startTimerId}
                          updateTimerId={this.updateTimerId}/>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={2} style={{backgroundColor:'white'}}>
                    <Grid container direction={'column'}>
                      <Grid item xs={12} style={{backgroundColor:'orange'}} >
                        <Button style={{fontSize:30}} onClick={() => this.onDraftButton()}>
                          Draft
                        </Button>
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
            <form onSubmit={this.handleSubmit}>
              <input
                onChange={this.handleChange}
                type="text"
                placeholder="Hello world!"
                value={this.state.field}/>
              <button>Send</button>
            </form>
            <form  noValidate>
              <TextField
                id="number"
                label="Start Time (secs)"
                onChange={this.handleStartTime}
                type="number"
                defaultValue="5"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </div>
          <SimpleSnackbar open={snackbarOpen} message={snackbarMessage} handleClose={this.handleSnackbarClose}/>    
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
      activeLeague : state.activeLeague
    }),
  null)(withStyles(styles)(DraftContainer))

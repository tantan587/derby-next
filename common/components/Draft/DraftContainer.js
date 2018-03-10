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
      startTime:Math.round((new Date(this.props.activeLeague.draft_start_time)-new Date())/1000),
      snackbarOpen:false,
      snackbarMessage:'',
      ownerMap:{},
      currPick:0,
      sockets:['people','message','start','reset',
        'startTick','draftTick', 'draftInfo'],
      functions : [this.handlePeople,this.handleMessage,
        this.handleStart, this.handleReset,
        this.handleStartTick, this.handleDraftTick, this.handleDraftInfo]
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
    this.state.sockets.map((socket,i) => 
      this.socket.on(socket, this.state.functions[i]))
 
    const ownerMap = {}
    this.props.activeLeague.owners.map(owner => {
      const here = owner.owner_id === this.props.activeLeague.my_owner_id
      ownerMap[owner.owner_id] =
       {draft_position:owner.draft_position, 
         owner_name:owner.owner_name,
         here:here}
    })
    this.setState({ownerMap:ownerMap})
  }

  componentWillUnmount() {
    this.state.sockets.map((socket,i) => 
      this.socket.off(socket, this.state.functions[i]))
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

  handleReset = (data) => {
    this.setState({ 
      draftState:'pre',
      startTime:Math.round((new Date(data.draftStartTime)-new Date())/1000) })
  }

  handleStart =() => {
    this.setState({draftState:'live', currPick:0 })
  }

  handleStartTick = () => {
    if(this.state.startTime < 5 && this.state.draftState ==='pre')
    {
      this.setState({ draftState: 'wait' })
    }
    if(this.state.startTime > 0)
    {
      this.setState({ startTime: this.state.startTime -1 })
    }
  }

  handleDraftTick = (counter) => {

    this.setState({countdownTime: counter})
      
  }
  handleDraftInfo = () => {
    this.setState({currPick:this.state.currPick+1})      
  }

  onTextChange = event => {
    this.setState({ field: event.target.value })
  }

  onStartTimeChange = event => {
    this.socket.emit('startTime',event.target.value)
  }

  onDraftButton = () => {
    this.socket.emit('draft')
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

  onSnackbarClose = (event, reason) => {
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
    const { preDraft, countdownTime, startTime,draftState,
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
                          countdownTime={countdownTime}/>
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
                          draftState={draftState}/>
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
            <form onSubmit={this.onSubmit}>
              <input
                onChange={this.onTextChange}
                type="text"
                placeholder="Hello world!"
                value={this.state.field}/>
              <button>Send</button>
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
      activeLeague : state.activeLeague
    }),
  null)(withStyles(styles)(DraftContainer))

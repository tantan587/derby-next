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
      time:0,
      isOn:false,
      isPaused:true,

    }
  }

  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io()
    this.socket.on('connect', () => {
      // Connected, let's sign-up for to receive messages for this room
      this.socket.emit('room', 'room123')
    })
    this.socket.on('message', this.handleMessage)
    this.socket.on('start', this.handleStart)
    this.socket.on('stop', this.handleStop)
    this.socket.on('restart', this.handleRestart)
  }

  componentWillUnmount() {
    this.socket.off('message', this.handleMessage)
    this.socket.off('start', this.handleStart)
    this.socket.off('stop', this.handleStop)
    this.socket.off('restart', this.handleRestart)
    this.socket.close()
  }

  // add messages from server to the state
  handleMessage = (message) => {
    message.c2id = (new Date()).getTime()
    this.setState(state => ({ messages: state.messages.concat(message) }))
  }

  handleRestart = (time) => {
    this.setState({ time:time,isOn:false })
  }

  handleStop =() => {
    this.setState({ isPaused:true })
  }

  handleStart =() => {
    this.setState({ isPaused:false })
  }

  handleChange = event => {
    this.setState({ field: event.target.value })
  }

  onTick = () => {
    if(this.state.time > 0)
    {this.setState({ time: this.state.time -1, isOn:true })}
    else
    {this.setState({ isOn:false })}

  }

  handleStartTime = event => {
    this.socket.emit('startTime',event.target.value)
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

  enterDraft()
  {
    this.setState({preDraft:false})

  }

  render() {
    const { classes } = this.props
    const { preDraft, time, isOn, isPaused } = this.state
    console.log('isOn: ', isOn, ' isPaused; ', isPaused)
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
                    style={{backgroundColor:'red'}}>
                    <Grid container direction={'column'}>
                      <Grid item xs={12} style={{backgroundColor:'orange'}} >
                        <Button style={{fontSize:30}}>
                          Draft
                        </Button>
                      </Grid>
                      <Grid item xs={12} style={{backgroundColor:'yellow'}}>
                        <Countdown countdownTime={time}  isOn={isOn} isPaused={isPaused} onTick={this.onTick}/>
                      </Grid>
                    </Grid>

                  </Grid>
                  <Grid item xs={12} sm={8} style={{backgroundColor:'blue'}}>
                  2
                  </Grid>
                  <Grid item xs={12} sm={2} style={{backgroundColor:'green'}}>
                  3
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
        </div>
    )
  }
}

DraftContainer.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DraftContainer)
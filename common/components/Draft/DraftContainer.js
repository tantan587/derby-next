import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import io from 'socket.io-client'

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
      messages:[]
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
  }

  componentWillUnmount() {
    this.socket.off('message', this.handleMessage)
    this.socket.close()
  }

  // add messages from server to the state
  handleMessage = (message) => {
    this.setState(state => ({ messages: state.messages.concat(message) }))
  }

  handleChange = event => {
    this.setState({ field: event.target.value })
  }

  // send messages to server and add them to the state
  handleSubmit = event => {
    event.preventDefault()

    // create message object
    const message = {
      id: (new Date()).getTime(),
      value: this.state.field,
    }

    // send object to WS server
    this.socket.emit('message', message)

    // add it to state and clean current input value
    this.setState(state => ({
      field: '',
      messages: state.messages.concat(message)
    }))
  }

  enterDraft()
  {
    this.setState({preDraft:false})

  }

  render() {
    const { classes } = this.props
    const { preDraft } = this.state

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
          <Grid container spacing={24}>
            <Grid item xs>
              <Paper className={classes.paper}>xs</Paper>
            </Grid>
            <Grid item xs>
              <Paper className={classes.paper}>xs</Paper>
            </Grid>
            <Grid item xs>
              <Paper className={classes.paper}>xs</Paper>
            </Grid>
          </Grid>
          <Grid container spacing={24}>
            <Grid item xs>
              <Paper className={classes.paper}>xs</Paper>
            </Grid>
            <Grid item sm={3} xs={6}>
              <Paper className={classes.paper}>xs=8</Paper>
            </Grid>
            <Grid item xs>
              <Paper className={classes.paper}>xs</Paper>
            </Grid>
          </Grid>
          <div>
            <ul>
              {this.state.messages.map(message =>
                <li key={message.id}>{message.value}</li>
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
          </div>
        </div>
    )
  }
}

DraftContainer.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DraftContainer)
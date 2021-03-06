import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send'
import { Scrollbars } from 'react-custom-scrollbars'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'

const styles = () => ({
  message : {
    paddingTop:0,
    paddingBottom:0,
  }
})

class Chat extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      field: '',
    }
  }

  scrollToBottom = () => {
    this.messagesEnd1.scrollToBottom()//{ behavior: 'smooth' })

  }

  componentDidUpdate() {
    this.scrollToBottom(false)
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  onTextChange = event => {
    this.setState({ field: event.target.value })
  }

  keypress(e) {
    if (e.key === 'Enter') {
      this.onPressSubmit()
    }
  }

  onPressSubmit = () =>{
    this.props.onMessageSubmit(this.state.field)
    this.setState({ field: '' })
  }

  render() {
    const {classes, messages, owners} = this.props

    let localOwners = {}
    owners.forEach(x => localOwners[x.owner_id] = x.owner_name)

    let localField = this.state.field === '\n' ? '' : this.state.field
    return (
      <div >
        <List style={{maxHeight: 250, overflow: 'auto', paddingTop:0}}>
          <Scrollbars autoHide style={{ height: 200 }} ref={(el) => { this.messagesEnd1 = el}}>
            {messages && messages.map( (message,i) =>
              <div key={i}>
                <ListItem className={classes.message} key={i}
                //key={message.messageId}
                >
                  {/* <Avatar>
                    <ImageIcon />
                  </Avatar> */}
                  <ListItemText disableTypography
                    primary=
                      {<Typography variant="body1" style={{ color: '#FFFFFF', fontWeight : 'bold' }}>
                        {localOwners[message.ownerId]}
                      </Typography>}
                    secondary={<Typography variant="body1" style={{ color: '#EEEEEE' }}>
                      {message.message}
                    </Typography>}/>
                </ListItem>
                }
              </div>
            )}
          </Scrollbars >
        </List>
        <Grid container spacing={24} >
          <Grid item xs={12}>
            <Paper style={{width:'90%', marginLeft:'4%', height:50, maxHeight:50}}>
              <Grid container alignItems='flex-end' direction='row'>
                <Grid item xs={10} sm={10}
                  style={{backgroundColor:'white', }}>
                  <Paper style={{overflowY: 'auto',  width:'100%'}}>
                    <Scrollbars autoHide  style={{ height:50, width:'100%'  }}>
                      <form onKeyPress={(event) => this.keypress(event)}>
                        <TextField
                          id="input1"
                          multiline
                          style={{width:'80%',overflowX:'hidden', marginTop:10}}
                          InputProps={{ disableUnderline: true}}
                          onChange={this.onTextChange}
                          placeholder="Say something"
                          value={localField}
                        />
                      </form>
                    </Scrollbars>
                  </Paper>
                </Grid>
                <Grid item xs={2} sm={2}
                  style={{backgroundColor:'white'}}>
                  <IconButton style={{width:35 }} onClick={this.onPressSubmit}>
                    <SendIcon/>
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>

    )
  }
}

export default connect(
  state =>
    ({
      owners : state.activeLeague.owners,
      messages : state.draft.messages,
    }),null)(withStyles(styles)(Chat))

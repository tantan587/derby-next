import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
// import Avatar from 'material-ui/Avatar'
// import ImageIcon from 'material-ui-icons/Image'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import SendIcon from 'material-ui-icons/Send'
import { Scrollbars } from 'react-custom-scrollbars'
import Grid from 'material-ui/Grid'

const styles = theme => ({
  message : {
    paddingTop:0,
    paddingBottom:0,
  }
})

class Chat extends React.Component {
  
  render() {
    const {classes} = this.props
    const messages = [{messageId:0, ownerName:'Tom',message:'helloe'},
      {messageId:1, ownerName:'Yoni',message:'helldo'}, 
      {messageId:2, ownerName:'Jamie',message:'helsdlo f asdf sdflk asdfhuawe asdifhasd sicas sdfasd sdfhiaf wief asdfsfkjasyo asdraskdf;iq iasdcwncaid acidsnfawneina cewnasdc hfhkf ifs dfiasd fadfhs iy fifaiwj ashd nafuwe cfiawe'}, 
      {messageId:3, ownerName:'Cat',message:'hedsllo'}]
    return (
      <div >
        <List style={{maxHeight: 300, overflow: 'auto', paddingTop:0}}>
          <Scrollbars autoHide style={{ height: 200 }}>
            {messages.map( message => 
              <div key={message.messageId}>
                <ListItem className={classes.message} key={message.messageId}>
                  {/* <Avatar>
                    <ImageIcon />
                  </Avatar> */}
                  <ListItemText disableTypography 
                    primary=
                      {<Typography variant="body1" style={{ color: '#FFFFFF', fontWeight : 'bold' }}>
                        {message.ownerName}
                      </Typography>}
                    secondary={<Typography variant="body1" style={{ color: '#EEEEEE' }}>
                      {message.message}
                    </Typography>}/>
                </ListItem>
                }
              </div>
            )}
          </Scrollbars>
        </List>
        <Grid container spacing={24} >
          <Grid item xs={12}>
            <Paper style={{width:'90%', marginLeft:'4%', height:50, maxHeight:50}}>
              <Grid container alignItems='flex-end' direction='row'>
                <Grid item xs={10} sm={10} 
                  style={{backgroundColor:'white', }}>
                  <Paper style={{overflowY: 'auto',  width:'100%'}}>
                    <Scrollbars autoHide  style={{ height:50, width:'100%'  }}>
                      <TextField
                        id="input1"
                        multiline
                        style={{width:'80%',overflowX:'hidden', marginTop:10}}
                        InputProps={{ disableUnderline: true}}
                      />
                    </Scrollbars> 
                  </Paper>
                </Grid>
                <Grid item xs={2} sm={2} 
                  style={{backgroundColor:'white'}}>
                  <IconButton style={{ }}>
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

export default withStyles(styles)(Chat)
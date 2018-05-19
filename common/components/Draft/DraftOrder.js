import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
// import Avatar from 'material-ui/Avatar'
// import ImageIcon from 'material-ui-icons/Image'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import { Scrollbars } from 'react-custom-scrollbars'

const styles = theme => ({
  greenFullCircle: {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor:'#229246',
  },
  greenOutlineCircle: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    borderColor : '#229246', 
    borderWidth:2,
    border:'solid'
  },
  button : {
    backgroundColor: theme.palette.secondary.A700,
    color: theme.palette.secondary.A100,
  },
  banner : {
    color: theme.palette.secondary[100],
    backgroundColor: theme.palette.primary[500],
  },
  onTheClock :
  { backgroundColor:'#229246', color:'white', textAlign: 'left', paddingLeft:20},

  round :
  {
    backgroundColor:'#707070', color:'white', textAlign: 'left', 
    paddingLeft:20, fontWeight : 'bold', paddingTop:5, paddingBottom:5
  },

  owner :
  {
    backgroundColor:'black', textAlign: 'left'
  }
})

class DraftOrder extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     top: 0 
  //   }}

  // handleUpdate =  (values)  => {
  //   const { top } = values
  //   this.setState({ top })
  // }

  // renderView =  ({ style, ...props }) => {
  //   const { top } = this.state
  //   const viewStyle = {
  //     padding: 15,
  //     backgroundColor: `rgb(${Math.round(255 - (top * 255))}, ${Math.round(top * 255)}, ${Math.round(255)})`,
  //     color: `rgb(${Math.round(255 - (top * 255))}, ${Math.round(255 - (top * 255))}, ${Math.round(255 - (top * 255))})`
  //   }
  //   return (
  //     <div
  //       className="box"
  //       style={{ ...style, ...viewStyle }}
  //       {...props}/>
  //   )
  // }
  render() {
    const { classes, owners,myOwnerName, draftOrder, currPick, mode } = this.props

    const ownerDraftOrder = []
    owners.map(x => ownerDraftOrder[x.draft_position]  = x)
    const ownerList = []
    draftOrder.map(x => {
      if(x.pick >= currPick)
        ownerList.push(
          {...ownerDraftOrder[x.ownerIndex],
            pick:x.pick % owners.length +1,
            round:Math.floor(x.pick /owners.length) + 1,
            overallPick:x.pick})        
    })
    const lastRound = ownerList.length > 0 ? ownerList[ownerList.length - 1].round : -1
    const showOnTheClock = mode === 'live' && ownerList.length > 0
    return (
      <div >
        <Divider style={{backgroundColor:'white'}}/>
        <Typography key={'head'} variant='subheading' 
          style={{fontFamily:'HorsebackSlab', backgroundColor:'black', color:'white', 
            paddingTop:10, paddingBottom:10}}>
            Draft Order
        </Typography>

        {showOnTheClock
          ?
          <div style={{paddingBottom:5, backgroundColor:'#229246'}}>
            <Typography className={classes.round} key={'first1'} variant='subheading'>
              {'ROUND ' + (ownerList[0].round) + ' - PICK ' + ownerList[0].pick}
            </Typography>
            <Divider style={{backgroundColor:'white'}}/> 
            <Typography variant='body2' 
              className={classes.onTheClock}>
            ON THE CLOCK:
            </Typography> 
            <Typography variant='title' 
              className={classes.onTheClock}>
              {myOwnerName === ownerList[0].owner_name ? ownerList[0].owner_name +' (you)':ownerList[0].owner_name}
            </Typography>
          </div> : <div/>}
        <Divider style={{backgroundColor:'white'}}/>  
        <List style={{maxHeight: 700, overflow: 'auto', paddingTop:0}}>
          <Scrollbars autoHide style={{ height: 600 }}>
            {/*renderView={this.renderView} onUpdate={this.handleUpdate}> */}
            {showOnTheClock || ownerList.length === 0  ? <div/> :
              <div>
                <Typography key='first2' className={classes.round} variant='subheading'>
                  {lastRound !== ownerList[0].round ? 'ROUND ' + (ownerList[0].round) : 'DRAFT OVER'}
                </Typography>
                <Divider/>
              </div>
            }
            {ownerList.filter((x,i) => showOnTheClock || mode === 'post' ? i !== 0 : i > -1).map( owner => 
              <div key={owner.overallPick}>
                
                <ListItem className={classes.owner} key={owner.overallPick}>
                  {/* <Avatar>
                    <ImageIcon />
                  </Avatar> */}
                  <ListItemText disableTypography 
                    primary=
                      {<Typography variant="subheading" style={{ color: '#FFFFFF' }}>
                        {owner.owner_name===myOwnerName ? owner.owner_name +' (you)':owner.owner_name}
                      </Typography>}
                    secondary={<Typography variant="body1" style={{ color: '#A0A0A0' }}>
                      {'Pick '+ owner.round +'.'+owner.pick}
                    </Typography>}/>

                  <div className={owner.here ? classes.greenFullCircle : classes.greenOutlineCircle}/>
                </ListItem>
                {owner.pick % owners.length === 0 && owner.round < draftOrder.length
                  ?
                  <div>
                    <Divider />
                    <Typography key={owner.round} className={classes.round} variant='subheading'>
                      {lastRound !== owner.round ? 'ROUND ' + (owner.round+1) : 'DRAFT OVER'}
                    </Typography>
                    <Divider />
                  </div>
                  :
                  <Divider />
                }
              </div>
            )}
          </Scrollbars>
        </List>

      </div>
    )
  }
}

DraftOrder.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DraftOrder)
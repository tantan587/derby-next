import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
// import ImageIcon from '@material-ui/icons/Image'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { Scrollbars } from 'react-custom-scrollbars'
import OwnerSilk from '../Icons/Avatars/OwnerSilk'
import Switch from '@material-ui/core/Switch'

const styles = theme => ({
  greenFullCircle: {
    backgroundColor:'#229246',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
  },
  greenOutlineCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    borderColor : '#229246', 
    borderWidth:2,
    border:'solid'
  },
  blackFullCircle: {
    backgroundColor:'#000',
    width: '20px',
    height: '20px',
    borderRadius: '50%'
  },
  blackOutlineCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    borderColor : '#000', 
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
  { backgroundColor:'#229246', color:'#e3dac9', textAlign: 'left', paddingLeft:20},

  round :
  {
    backgroundColor:'#e3dac9', color:'#229246', textAlign: 'left', 
    paddingLeft:20, fontWeight : 'bold', paddingTop:5, paddingBottom:5
  },
  switchRoot: {
    height: 20,
    borderRadius: 3,
    opacity: '1 !important',
    backgroundColor: '#E2E2E2'
  },
  icon: {
    height: 15,
    width: 15,
    marginTop: 5,
    borderRadius: 3,
    color: 'white',
    backgroundColor: 'white'

  },
  checked: {
    color: 'blue',
    '& + span' : {
      backgroundColor: '#299149 !important'
    }
  }
})

class DraftOrder extends React.Component {

  toggleAutodraft = () => {
    this.props.toggleAutoDraft()
  }
  render() {
    const { classes, ownersMap,myOwnerName, draftOrder, currPick, mode, autoDraftMap, myOwnerId } = this.props
    
    const ownerDraftOrder = []
    
    Object.keys(ownersMap).map(x => ownerDraftOrder[ownersMap[x].draft_position]  = {ownerId:x, ...ownersMap[x]})
    let ownersLength = ownerDraftOrder.length
    const ownerList = []
    draftOrder.map(x => {
      if(x.pick >= currPick)
        ownerList.push(
          {...ownerDraftOrder[x.ownerIndex],
            pick:x.pick % ownersLength +1,
            round:Math.floor(x.pick /ownersLength) + 1,
            overallPick:x.pick})        
    })
    const lastRound = ownerList.length > 0 ? ownerList[ownerList.length - 1].round : -1
    const showOnTheClock = mode === 'live' && ownerList.length > 0
    return (
      <div >
        <Divider style={{backgroundColor:'#e3dac9'}}/>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
          <Typography key={'auto'} variant='subheading' style={{color:'white', marginTop:6, flexGrow:10, textAlign:'left', marginLeft:10}}>
              Auto Draft
          </Typography>
          <Switch
            checked={autoDraftMap[myOwnerId]}
            classes={{
              root: classes.root,
              bar: classes.switchRoot,
              icon: classes.icon,
              checked: classes.checked,
            }} onClick={this.toggleAutodraft}/>
        </div>
        <Divider style={{backgroundColor:'#e3dac9'}}/>
        <Typography key={'head'} variant='subheading' 
          style={{fontFamily:'museo-slab-bold', backgroundColor:'black', color:'white', 
            paddingTop:10, paddingBottom:10}}>
            DRAFT ORDER
        </Typography>

        {showOnTheClock
          ?
          <div style={{paddingBottom:5, backgroundColor:'#229246'}}>
            <Typography className={classes.round} key={'first1'} variant='subheading'>
              {'ROUND ' + (ownerList[0].round) + ' - PICK ' + ownerList[0].pick}
            </Typography>
            <Divider style={{backgroundColor:'#e3dac9'}}/> 
            <Typography variant='body2' 
              className={classes.onTheClock}>
            ON THE CLOCK:
            </Typography> 
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:10}}>
              <Avatar style={{ height: 35, width: 35, backgroundColor:'black', marginLeft:5 }}>
                {OwnerSilk(ownerList[0].avatar, { height: 35, width:35 })}
              </Avatar> 
              <Typography style={{flexGrow:4, paddingLeft:0, marginLeft:10,marginRight:10, fontSize:20}} variant='body1'
                className={classes.onTheClock}>
                {myOwnerName === ownerList[0].owner_name ? ownerList[0].owner_name +' (you)':ownerList[0].owner_name}
              </Typography>
              <div style={{minWidth: 40, display:'flex', alignItems:'center', justifyContent:'center'}} >
                <div 
                  className={ownerList[0].here ? classes.blackOutlineCircle : classes.blackFullCircle}>
                  {autoDraftMap[ownerList[0].ownerId] ?
                    <Typography style={{color:ownerList[0].here ? '#000' :'#229246', marginTop: ownerList[0].here ? -2 : 0}}>A</Typography>
                    : null
                  }
                </div>
              </div>
            </div>
          </div> : <div/>}
        <Divider style={{backgroundColor:'#e3dac9'}}/>  
        <List style={{maxHeight: 560, overflow: 'auto', paddingTop:0}}>
          <Scrollbars autoHide style={showOnTheClock? { height:455 } : { height:530 } }>
            {/*renderView={this.renderView} onUpdate={this.handleUpdate}> */}
            {showOnTheClock || ownerList.length === 0  ? <div/> :
              <div>
                <Typography key='first2' className={classes.round} variant='subheading'>
                  {lastRound !== ownerList[0].round ? 'ROUND ' + (ownerList[0].round) : 'DRAFT OVER'}
                </Typography>
                <Divider style={{backgroundColor:'#e3dac9'}}/>
              </div>
            }
            {ownerList.filter((x,i) => showOnTheClock || mode === 'post' ? i !== 0 : i > -1).map( owner => 
              <div key={owner.overallPick}>
                <ListItem style={{display:'flex', alignItems:'center', justifyContent:'space-between', backgroundColor:'black', paddingLeft:0, paddingRight:0}}>
                  <Avatar style={{ height: 35, width: 35, backgroundColor:'black', marginLeft:5 }}>
                    {OwnerSilk(owner.avatar, { height: 35, width:35 })}
                  </Avatar> 
                  <ListItemText disableTypography 
                    primary=
                      {<Typography variant="body1" style={{   color: owner.owner_name===myOwnerName  ? '#EBAB38' :  'white' }}>
                        {owner.owner_name}
                      </Typography>}
                    secondary={<Typography variant="body1" style={{ color: '#A0A0A0' }}>
                      {'Pick '+ owner.round +'.'+owner.pick}
                    </Typography>}/>
                  <div style={{minWidth: 40, display:'flex', alignItems:'center', justifyContent:'center'}} >
                    <div 
                      className={owner.here ? classes.greenFullCircle : classes.greenOutlineCircle}>
                      {
                        autoDraftMap[owner.ownerId] ?
                          <Typography style={{color:owner.here ? '#000' : '#229246', marginLeft:owner.here ? 5.7: 3.4, marginTop: owner.here ? 0 : -2}}>A</Typography>
                          : null
                      }
                      
                    </div>
                  </div>
                </ListItem>
                {owner.pick % ownersLength === 0 && owner.round < draftOrder.length
                  ?
                  <div>
                    <Divider style={{backgroundColor:'#e3dac9'}} />
                    <Typography key={owner.round} className={classes.round} variant='subheading'>
                      {lastRound !== owner.round ? 'ROUND ' + (owner.round+1) : 'DRAFT OVER'}
                    </Typography>
                    <Divider style={{backgroundColor:'#e3dac9'}}/>
                  </div>
                  :
                  <Divider style={{backgroundColor:'#e3dac9'}}/>
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
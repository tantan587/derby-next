import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ImageIcon from 'material-ui-icons/Image';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography'

const styles = theme => ({
  greenFullCircle: {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor:'green',
  },
  greenOutlineCircle: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    borderColor : 'green', 
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
  }
})

class DraftOrder extends React.Component {

  render() {
    const { classes, owners,myOwnerName, totalTeams, currPick } = this.props

    const ownerList = []
    for(let round = 0; round < totalTeams; round++)
    {
      for(let pick = 0; pick < owners.length; pick++)
      {
        let overallPick = pick + round*owners.length
        if(overallPick >= currPick)
        {
          ownerList.push({...owners[pick], pick:pick+1, round:round+1, overallPick:overallPick+1})
        }
      }
    }
    return (
      <div >
        <List style={{maxHeight: 600, overflow: 'auto'}}>
          <Typography key={'head'} type='display1'>
            Next Up
          </Typography>
          <Divider />
          <Typography key={'first'} type='subheading'>
            {ownerList.length > 0 ? 'Round ' + (ownerList[0].round) : 'Draft Over'}
          </Typography>
          <Divider />
          {ownerList.map( owner => 
            <div key={owner.overallPick}>
              <ListItem key={owner.overallPick}>
                {/* <Avatar>
                  <ImageIcon />
                </Avatar> */}
                <ListItemText primary={owner.owner_name===myOwnerName ? owner.owner_name +' (you)':owner.owner_name}
                  secondary={'Pick '+ owner.round +'.'+owner.pick} />
                <div className={owner.here ? classes.greenFullCircle : classes.greenOutlineCircle}/>
              </ListItem>
              {owner.pick % owners.length === 0 && owner.round < totalTeams
                ?
                <div>
                  <Divider />
                  <Typography key={owner.round} type='subheading'>
                    {'Round ' + (owner.round+1)}
                  </Typography>
                  <Divider />
                </div>
                :
                <Divider />
              }
            </div>
          )}
        </List>

      </div>
    )
  }
}

DraftOrder.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DraftOrder)
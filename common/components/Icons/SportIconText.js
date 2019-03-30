import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import SportIcon from './SportIcon'
import SportText from './SportText'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  
})

class SportIconText extends React.Component {

  render() {
    const {sportId, color, text, style} = this.props
    return (
     
      sportId === 'All' || sportId === 'My Teams' ? 
        <div>
          <Typography style={{fontFamily:'museo-slab-bold', color, fontSize:20}}>
            {sportId === 'My Teams' ? 'My' : sportId}
          </Typography> 
          <Typography style={{fontFamily:'museo-slab-bold', color, fontSize:20}}>
          Teams
          </Typography>  
        </div>
        : <div style={{ width:80, ...style}}> 
          <SportIcon 
            color={color ? color : 'white'} 
            sportId={sportId}
          />
          <SportText text={text} sportId={sportId} color={color}/>
        </div>
      
    )
  }
}
export default withStyles(styles)(SportIconText)
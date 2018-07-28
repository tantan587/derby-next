import React from 'react'
import SportIcon from './SportIcon'
import SportText from './SportText'
import Typography from '@material-ui/core/Typography'
class SportIconText extends React.Component {

  render() {
    const {sportId, color} = this.props
    return (
      <div>
        {sportId === 'All' || sportId === 'My Teams' ? 
          <div>
            <Typography style={{fontFamily:'museo-slab-bold', color, fontSize:20}}>
              {sportId === 'My Teams'? 'My' : sportId}
            </Typography> 
            <Typography style={{fontFamily:'museo-slab-bold', color, fontSize:20}}>
            Teams
            </Typography>  
          </div>
          : <div style={{width:80}}> 
            <SportIcon 
              color={color ? color : 'white'} 
              sportId={sportId}
            />
            <SportText sportId={sportId} color={color}/>
          </div> }
      </div> 
    )
  }
}
export default SportIconText
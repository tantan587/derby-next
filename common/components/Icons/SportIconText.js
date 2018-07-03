import React from 'react'
import Typography from '@material-ui/core/Typography'
class SportIconText extends React.Component {

  render() {
    const {src, name} = this.props
    
    return (
      <div style={{width:80, display:'inline-block'}}> 
        <img src={src} alt="none" width={30}  height='auto'/>
        <Typography style={{color:'white'}}>
          {name}
        </Typography>
      </div> 
    )
  }
}
export default SportIconText
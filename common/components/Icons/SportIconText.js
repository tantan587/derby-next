import React from 'react'
import Typography from 'material-ui/Typography'
class SportIconText extends React.Component {

  
  render() {
    const {link, name, color} = this.props
    return (
      <div style={{width:50, display:'inline-block'}}> 
        <img src={link} alt="ok" width="16" height="16"/>
        <Typography style={{color:color}}>
          {name}
        </Typography>
      </div> 
    )
  }
}
export default SportIconText
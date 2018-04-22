import React from 'react'
import Typography from 'material-ui/Typography'
class HomeTitle extends React.Component {

  render() {
    const {title, color} = this.props
    return (
      <Typography 
        type="display1" style={{color:color}}>
        <div style={{ fontFamily:'HorsebackSlab', display: 'inline'}}>
          {title}
        </div>
      </Typography>
    )
  }
}
export default HomeTitle
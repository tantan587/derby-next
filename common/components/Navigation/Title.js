import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const styles = () => ({
  title : {
    textAlign : 'center',
    color:'white',
    fontFamily:'HorsebackSlab',
    marginLeft:'3%'
  },
  appBar : {
    height:'55px', 
    boxShadow: ['none']}
})

class Title extends React.Component {

  render() {
    const {backgroundColor, title, color, classes} = this.props
    return (
      <AppBar position="static" 
        className={classes.appBar}
        style={{backgroundColor:backgroundColor, color:color}}>
        <Toolbar>
          <Typography className={classes.title} type="display1">{title}</Typography>
      
        </Toolbar>
      </AppBar> 
    )
  }
}
export default withStyles(styles)(Title)
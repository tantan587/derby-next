import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core//Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  title : {
    textAlign : 'center',
    color:'white',
    fontFamily:'HorsebackSlab',
    marginLeft:'3%'
  },
  subheading: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: '"Roboto", sans-serif',
  },
  appBar : {
    height:'55px',
    boxShadow: ['none']}
})

class Title extends React.Component {

  render() {
    const {backgroundColor, title, subheading, color, classes} = this.props
    return (
      <AppBar position="static"
        className={classes.appBar}
        style={{backgroundColor:backgroundColor, color:color}}>
        <Toolbar>
          <Typography className={classes.title} variant="display1">
            {title}
            <span className={classes.subheading}>{subheading}</span>
          </Typography>

        </Toolbar>
      </AppBar>
    )
  }
}
export default withStyles(styles)(Title)

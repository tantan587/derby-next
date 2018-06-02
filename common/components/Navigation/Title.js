import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core//Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  title : {
    textAlign : 'left',
    color:'white',
    fontFamily:'HorsebackSlab',
    zIndex:2,
    height:'45px',
    paddingTop:10,
    marginBottom:0,
    paddingLeft:'3%',
  },
  subheading: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: '"Roboto", sans-serif',
  },
  appBar : {

    boxShadow: ['none']}
})

class Title extends React.Component {

  render() {
    const {backgroundColor, title, subheading, color, classes} = this.props
    return (

          <Typography className={classes.title}  style={{backgroundColor:backgroundColor, color:color}} variant="display1">
            {title}
            <span className={classes.subheading}>{subheading}</span>
          </Typography>
    )
  }
}
export default withStyles(styles)(Title)

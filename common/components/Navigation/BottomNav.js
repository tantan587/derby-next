import React from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { connect } from 'react-redux'
import LogoIcon from '../Icons/LogoIcon'


const styles = () => ({
  root: {
    flexGrow: 1,
    backgroundColor:'#48311A',
    textAlign: 'center',
    minHeight:325
  },
  flex: {
    flex: 1,
  },
})
class BottomNav extends React.Component {
  
 

  render() {
    const {classes} = this.props
    
    return (
      <div className={classes.root}>
        <div style={{display:'inline-block',float:'left'}}>
          <div style={{height:325, width:325}}>
            <LogoIcon color='#594632' viewbox='15 0 62 62'/>
          </div>
        </div>
        <Typography variant='display3' style={{color:'white', paddingTop:50, display:'inline-block'}}>
        Footer Info
        </Typography>
        <br/>
        <Typography variant='display3' style={{color:'white', display:'inline-block'}}>
        Footer Info
        </Typography>
        <br/>
        <Typography variant='display3' style={{color:'white', display:'inline-block'}}>
        Footer Info
        </Typography>
      </div>

    )
  }
}

export default connect(({ user}) => ({ user }),
  null)(withStyles(styles)(BottomNav))
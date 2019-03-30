import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import sportLeagues from '../../../data/sportLeagues.json'

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

class SportText extends React.Component {

  render() {
    const {sportId, text, color, classes, fontSize} = this.props
    let sportLeague = sportLeagues[sportId]
    return (
      text ?
        <div className={classes.container}>
          <Typography style={{color:color || 'white', fontSize : fontSize || 14}}>
            {text[0]}
          </Typography>
          <Typography style={{color:color || 'white', fontSize : fontSize || 14}}>
            {text[1]}
          </Typography>
        </div> :
        <Typography style={{color:color || 'white', fontSize : fontSize || 14}}>
          {sportLeague && sportLeague.displayName ? sportLeague.displayName : sportId}
        </Typography>
    )
  }
}
export default withStyles(styles)(SportText)
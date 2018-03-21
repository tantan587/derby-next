import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import ImageIcon from 'material-ui-icons/Image'
import Divider from 'material-ui/Divider'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'

const styles = theme => ({
  greenFullCircle: {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor:'green',
  },
  greenOutlineCircle: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    borderColor : 'green', 
    borderWidth:2,
    border:'solid'
  },
  button : {
    backgroundColor: theme.palette.secondary.A700,
    color: theme.palette.secondary.A100,
  },
  banner : {
    color: theme.palette.secondary[100],
    backgroundColor: theme.palette.primary[500],
  }
})

class TeamDisplay extends React.Component {

  addItem = (team) =>
  {
    this.props.dataForTeams.addToQueue(team)
  }

  render() {
    const { classes, dataForTeams } = this.props
    const availableTeams = dataForTeams.availableTeams
    const queue = dataForTeams.queue
    const linesToShow = dataForTeams.linesToShow
    const teamsToShow = []
    availableTeams.map(teamId => {
      if(queue.indexOf(teamId) === -1)
        teamsToShow.push(dataForTeams.teams[teamId])
    })
    teamsToShow.sort(function(a,b)
    { return a.team_id < b.team_id ? -1 : 1})
    return (
      <div style={{paddingTop:10}}>
        <Toolbar style={{backgroundColor:'#DDDDDD'}}>
          <Typography variant="title" color="inherit">
            Autosuggest for team, chips for sport, draft toggle
          </Typography>
        </Toolbar>

        <List style={{maxHeight: 600, overflow: 'auto'}}>
          <Divider />
          {teamsToShow.slice(0,linesToShow).map( team => 
            <div key={team.team_id}>
              <ListItem key={team.team_id} style={{paddingTop:0, paddingLeft:100}}>
                {/* <Avatar>
                  <ImageIcon />
                </Avatar> */}
                <ListItemText primary={team.team_name}/>
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  //className={classes.close}
                  onClick={() => this.addItem(team.team_id)}
                >
                  <ChevronRightIcon />
                </IconButton>
              </ListItem>
            </div>
          )}
        </List>

      </div>
    )
  }
}

TeamDisplay.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TeamDisplay)
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TeamDisplay from './TeamDisplay'
import DraftResults from './DraftResults'
import Roster from './Roster'
import RosterGrid from './RosterGrid'

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  deepindicator : {
    height:0,
    minWidth:50,
    maxWidth:500
  },
  deeptext : {
    fontSize:16
  },
  tab : {
    fontFamily:'museo-slab-bold',
    backgroundColor: '#ffffff',
    borderRight: '0.1em solid #E2E2E2', padding: '0.5em',
    color:'#392007'
  },
  tabSelected : {
    fontFamily:'museo-slab-bold',
    backgroundColor: '#e3dac9',
    borderRight: '0.1em solid #E2E2E2', padding: '0.5em'
  }
})

class CenteredTabs extends React.Component {
  state = {
    value: 1
  };

  handleChange = (event, value) => {
    this.setState({ value })
  };

  render() {
    const { classes } = this.props
    const { value } = this.state

    return (
      <div  className={classes.root}>
        <Tabs
          value={this.state.value}
          style={{backgroundColor:'white', width:'96%', marginLeft:'1.9%'}}
          onChange={this.handleChange}
          classes={{indicator: classes.deepindicator}}
          textColor="primary"
          fullWidth
          scrollable
          //centered
        >
          <Tab label="ROSTER" 
            classes={{label: classes.deeptext}}
            className={ value === 0 ? classes.tabSelected : classes.tab}
            style={{borderLeft: '0.1em solid #E2E2E2', padding: '0.5em'}}/>
          <Tab label="TEAMS" 
            classes={{label: classes.deeptext}}
            className={ value === 1 ? classes.tabSelected : classes.tab} />
          <Tab label="ROSTER GRID" 
            classes={{label: classes.deeptext}}
            className={ value === 2 ? classes.tabSelected : classes.tab}/>
          <Tab label="DRAFT RESULTS" 
            classes={{label: classes.deeptext}}
            className={ value === 3 ? classes.tabSelected : classes.tab} />
        </Tabs>
        {value === 0 && <Roster/>}
        {value === 1 && <TeamDisplay
          onAddQueue={this.props.onAddQueue}
          onUpdateQueue={this.props.onUpdateQueue} 
          onDraftButton={this.props.onDraftButton}
          allowDraft={this.props.allowDraft}/>}
        {value === 2 && <RosterGrid/>}
        {value === 3 && <DraftResults/>}
      </div>
    )
  }
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CenteredTabs)



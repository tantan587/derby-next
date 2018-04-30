import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
//import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'
import TeamDisplay from './TeamDisplay'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  deepindicator : {
    height:0
  },
  deeptext : {
    fontSize:18
  },
  tab : {
    fontFamily:'museo-slab-bold',
    backgroundColor: '#707070',
    borderRight: '0.1em solid #E2E2E2', padding: '0.5em'
  },
  tabSelected : {
    fontFamily:'museo-slab-bold',
    backgroundColor: '#E2E2E2',
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
          style={{backgroundColor:'#707070'}}
          onChange={this.handleChange}
          classes={{indicator: classes.deepindicator}}
          textColor="primary"
          fullWidth
          centered
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
        {value === 0 && <TabContainer>One</TabContainer>}
        {value === 1 && <TeamDisplay onAddQueue={this.props.onAddQueue}/>}
        {value === 2 && <TabContainer>Three</TabContainer>}
        {value === 3 && <TabContainer>Four</TabContainer>}
      </div>
    )
  }
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CenteredTabs)



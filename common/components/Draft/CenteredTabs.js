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
})

class CenteredTabs extends React.Component {
  state = {
    value: 0
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
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="Roster" />
          <Tab label="Teams" />
          <Tab label="Team Roster Grid" />
          <Tab label="Draft Results" />
        </Tabs>
        {value === 0 && <TabContainer>One</TabContainer>}
        {value === 1 && <TeamDisplay dataForTeams={this.props.dataForTeams}/>}
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



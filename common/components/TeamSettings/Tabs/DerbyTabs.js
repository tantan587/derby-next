import { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const styles = {
  root: {
  },
  tabsBottom: {
    height: 10,
    backgroundColor: '#E2E2E2'
  },
  tabsRoot: {
    fontFamily: 'HorsebackSlab',
    color: '#299149'
  },
  tabsIndicator: {
    display: 'none'
  },
  tabRoot: {
    width: 200,
    fontFamily: 'HorsebackSlab',
    color: '#E2E2E2',
    backgroundColor: '#999999',
  },
  tabSelected: {
    backgroundColor: '#E2E2E2',
    color: '#299149'
  }
}

class DerbyTabs extends Component {
  state = { value: 0 }

  handleChange = (event, value) => this.setState({ value })

  render() {
    const { value } = this.state
    const { classes, tabsList } = this.props

    return (
      <div>
        <Tabs
          value={value}
          onChange={this.handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          {
            tabsList.map((tab, idx) =>
              <Tab
                classes={{
                  root: classes.tabRoot,
                  selected: classes.tabSelected
                }}
                key={idx}
                label={tab.label}
              />
            )
          }
        </Tabs>
        <div className={classes.tabsBottom} />
        { tabsList[value].Component }
      </div>
    )
  }
}

export default withStyles(styles)(DerbyTabs)

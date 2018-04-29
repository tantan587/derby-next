import React from 'react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'



const styles = theme => ({
  button : {
    color:'black',
    borderRadius: '0px',
  },
  appBar : {
    height:'50px', 
    boxShadow: ['none']}
})

class TabFilter extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      index: 3,
    }
  }

  componentWillMount() {
    this.filterRows(this.state.index)
  }

  handleTabClick = index => () =>
  {
    this.setState({ index: index })
    this.filterRows(index)

  }

  filterRows = (index) => {
    const {rows, column, tabs, updateMyRows, passUpFilterInfo} = this.props

    const filter = index === tabs.length ? 0 : tabs[index]

    const localRows = filter ? rows.filter(row => row[column] === filter) : rows
    updateMyRows(localRows)
    if (passUpFilterInfo)
    {
      passUpFilterInfo({key:column, value:filter})
    }

  }

  render() {
    const {tabs, allInd, classes, tabColors} = this.props
    const {index} = this.state
    let localTabs = allInd ? tabs.concat('All') : tabs
    
    return (
      <div style={{width: '96%'}}>
        <AppBar position="static" 
          className={classes.appBar}
          style={{backgroundColor:tabColors.background, marginLeft:'2%'}} >
          <Toolbar>
            {localTabs.map((x,i) => 
              i === index ?
                <Button key={i} 
                  className={classes.button} 
                  style={{backgroundColor:tabColors.foreground, color:tabColors.text}}
                  onClick={this.handleTabClick(i)}
                >{x}</Button> :
                <Button key={i} 
                  className={classes.button} 
                  onClick={this.handleTabClick(i)}
                >{x}</Button> 
            )}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(TabFilter)
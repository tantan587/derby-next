import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { Scrollbars } from 'react-custom-scrollbars'



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
      index: 0,
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
      passUpFilterInfo({key:column, value:filter, type:'tab'})
    }

  }

  render() {
    const {tabs, allInd, classes, tabStyles} = this.props
    const {index} = this.state
    let localTabs = allInd ? tabs.concat('All') : tabs
    
    return (
      <div style={{width: '96%'}}>
        <AppBar position="static" 
          className={classes.appBar}
          style={{backgroundColor:tabStyles.background, marginLeft:'2%'}} >
          <Scrollbars autoHide autoHeight style={{ width: '100%'}}>
            <Toolbar>
              {localTabs.map((x,i) => 
                i === index ?
                  <Button key={i} 
                    className={classes.button} 
                    style={{backgroundColor:tabStyles.foreground, 
                      color:tabStyles.text, fontSize:tabStyles.fontSize}}
                    onClick={this.handleTabClick(i)}
                  >{x}</Button> :
                  <Button key={i}
                    style={{fontSize:tabStyles.fontSize}} 
                    className={classes.button} 
                    onClick={this.handleTabClick(i)}
                  >{x}</Button> 
              )}
            </Toolbar>
          </Scrollbars>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(TabFilter)
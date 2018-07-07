import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { Scrollbars } from 'react-custom-scrollbars'
import SportIconText from '../../Icons/SportIconText'


const styles = () => ({
  button : {
    color:'black',
    borderRadius: '0px',
    position:'relative'
  },
  appBar : {
    height:'50px',
    boxShadow: ['none']}
})

class TabFilter extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      index: props.defaultTab ? props.defaultTab : 0,
    }
  }

  componentWillMount() {
    this.filterRows(this.state.index)
  }

  // componentDidMount() {
  //   if(this.props.defaultTab)
  //     this.setState({index:this.props.defaultTab})
  // }

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
    const {tabs, allInd, sportImageInd, classes, tabStyles} = this.props
    const {index} = this.state
    let localTabs = allInd ? tabs.concat('All') : tabs
    let height = sportImageInd ? 90 : 50
    return (
      <div style={{width: '96%'}}>
        <AppBar position="static"
          className={classes.appBar}
          style={{backgroundColor:tabStyles.backgroundColor, marginLeft:'2%', height:height }} >
          <Scrollbars autoHide autoHeight style={{ width: '100%'}}>
            <Toolbar style={{}}>
              {localTabs.map((x,i) => {
                let style = i === index ? {backgroundColor:tabStyles.selectedBackgroundColor,
                  color:tabStyles.selectedColor} : {color:tabStyles.color}
                let display = sportImageInd ? <SportIconText tabInd={true} color={style.color} sportId={x}/> : x
                return <Button key={i}
                  className={classes.button}
                  style={{...style,fontSize:tabStyles.fontSize, height:height, width:80}}
                  onClick={this.handleTabClick(i)}>
                  {display}
                </Button>
              })}
            </Toolbar>
          </Scrollbars>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(TabFilter)

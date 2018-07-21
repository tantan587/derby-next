import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import { Scrollbars } from 'react-custom-scrollbars'
import SportIconText from '../Icons/SportIconText'
import SportText from '../Icons/SportText'

const styles = () => ({
  button : {
    color:'black',
    borderRadius: '0px',
    position:'relative'
  },
  appBar : {
    //height:'50px',
    boxShadow: ['none']}
})

class TabFilter extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      index: props.defaultTab || 0,
      localTabs: props.tabs // this.calculateTabs(props)
    }
  }

  calculateTabs = (props) => {
    let localTabs = props.tabs
    localTabs = props.allInd ? ['All'].concat(localTabs) : localTabs
    localTabs = props.myOwnerName ? localTabs.concat('Mine') : localTabs
    return localTabs
  }

  componentDidMount() {
    this.filterRows(this.state.index)
  }
  
  handleTabClick = (index) => () =>
  {
    this.setState({ index: index })
    this.filterRows(index)

  }

  filterRows = (index) => {
    const { column, tabs, clickedUpdateFilter, filterId} = this.props
    const {localTabs} = this.state

    const filter = localTabs && tabs.includes(localTabs[index]) ? localTabs[index] : null
    clickedUpdateFilter({key:column, value:filter, type:'tab'}, filterId)
  }

  render() {
    const {sportInd, imageInd, classes, tabStyles} = this.props
    const {index, localTabs} = this.state
    let height = sportInd && imageInd ? 100 : 50
    return (
      <div style={{width:'96%'}}>
        <AppBar position="static"
          className={classes.appBar}
          style={{backgroundColor:tabStyles.backgroundColor, marginLeft:'2%', height:height, minHeight:height }} >
          <Scrollbars autoHide style={{ width: '100%'}}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'flex-end',height:height }}>
              {localTabs.map((x,i) => {
                let style = i === index ? {backgroundColor:tabStyles.selectedBackgroundColor,
                  color:tabStyles.selectedColor} : {color:tabStyles.color}
                let display = sportInd ? 
                  imageInd ? 
                    <SportIconText color={style.color} sportId={x}/> 
                    : <SportText color={style.color} sportId={x} fontSize={tabStyles.fontSize}/>
                  : x
                return <Button key={i}
                  className={classes.button}
                  style={{...style,fontSize:tabStyles.fontSize, minWidth:80 }}
                  onClick={this.handleTabClick(i, localTabs)}>
                  {display}
                </Button>
              })}
            </div>
          </Scrollbars>
        </AppBar>
      </div>
    )
  }
}

export default withStyles(styles)(TabFilter)

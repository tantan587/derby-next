import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import { Scrollbars } from 'react-custom-scrollbars'
import SportIconText from '../Icons/SportIconText'
import SportText from '../Icons/SportText'
import ContainerDimensions from 'react-container-dimensions'


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
    }
  }

  componentDidMount() {
    this.filterRows(this.state.index)
  }
  
  handleTabClick = (index) => () =>
  {
    this.setState({ index})
    this.filterRows(index)

  }

  filterRows = (index) => {
    const { column, tabs, clickedUpdateFilter,removeFiltersBelow, filterId} = this.props
    clickedUpdateFilter({key:column, value:tabs[index], type:'tab'}, filterId)
    removeFiltersBelow(filterId)
  }

  render() {
    const {displayType, classes, tabStyles, tabs} = this.props
    const {index} = this.state
    let height = displayType ==='sportsIcon' ? 100 : 50
    return (
      <div style={{width:'96%'}}>
        <AppBar position="static"
          className={classes.appBar}
          style={{backgroundColor:tabStyles.backgroundColor, marginLeft:'2%', height:height, minHeight:height }} >
          <Scrollbars autoHide style={{ width: '100%'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end',height:height }}>
              {tabs.map((x,i) => {
                
                let style = i === index ? {backgroundColor:tabStyles.selectedBackgroundColor,
                  color:tabStyles.selectedColor} : {color:tabStyles.color}

                
                let display = x
                let textInd = false

                if (displayType ==='sportsIcon')
                  display = <SportIconText color={style.color} sportId={x}/> 
                else if (displayType ==='sportsName')
                  display = <SportText color={style.color} sportId={x} fontSize={tabStyles.fontSize}/>
                else
                  textInd = true

                return <Button key={i}
                  className={classes.button}
                  style={{...style,fontSize:tabStyles.fontSize, minWidth:100 }}
                  onClick={this.handleTabClick(i)}>

                  <ContainerDimensions>
                    { ({width}) => 
                    {
                      if (textInd)
                        return <div style={{fontSize: width < 90 && x.length > 16 ? 9 : 12}}>{x}</div> 
                      return display}}
                  </ContainerDimensions>
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

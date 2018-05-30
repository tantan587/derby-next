import React from 'react'
import { withStyles } from '@material-ui/core/styles'
//import SearchBar from 'material-ui-search-bar'



const styles = theme => ({
  searchIcon : {
    marginTop:8,
    color:'black',
    fontSize:16,
    font:'roboto',
    marginLeft:-28,
    opacity:1
  },
  appBar : {
    height:'50px', 
    boxShadow: ['none']}
})

class SearchFilter extends React.Component {

  constructor(props, context) {
    super(props, context)

    this.state = {
      value: '',
    }
  }

  
  filterRows = word => {
    this.setState({
      value: word,
    })
    const {rows, column, updateMyRows, passUpFilterInfo} = this.props
    const localRows = word  ? rows.filter(row => row[column].toLowerCase().includes(word.toLowerCase())) : rows
    updateMyRows(localRows)
    if (passUpFilterInfo)
    {
      passUpFilterInfo({key:column, value:word, type:'search'})
    }
  }

  // filterRows = (index) => {
  //   const {rows, column, tabs, updateMyRows, passUpFilterInfo} = this.props

  //   const filter = index === tabs.length ? 0 : tabs[index]

  //   const localRows = filter ? rows.filter(row => row[column] === filter) : rows
  //   updateMyRows(localRows)
  //   if (passUpFilterInfo)
  //   {
  //     passUpFilterInfo({key:column, value:filter})
  //   }

  // }

  render() {
    const {classes} = this.props
    return(
      <div/>
      // <SearchBar
      //   onChange={this.filterRows}
      //   onRequestSearch={() => console.log('onRequestSearch')}
      //   value={this.state.value}
      //   placeholder='Search Teams'
      //   style={{
      //     marginTop:15,
      //     marginBottom:5,
      //     marginRight:'3.1%',
      //     float:'right',
      //     width:300,
      //     boxShadow: 'none',
      //     borderBottom: '1px solid #A0A0A0',
      //     height:37,
      //     color:'black'
      //   }}
      //   classes={{root: classes.searchIcon}}
      // />
    )
  }
}

export default withStyles(styles)(SearchFilter)